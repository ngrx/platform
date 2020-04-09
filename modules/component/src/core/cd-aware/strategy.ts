// @Notice this part of the code is in the coalescing PR https://github.com/ngrx/platform/pull/2456
// import { generateFrames } from '../projections/generateFrames';
// import { coalesce } from '../operators/coalesce';
import { defer, from, MonoTypeOperatorFunction, Observable } from 'rxjs';
import {
  ChangeDetectorRef,
  NgZone,
  ɵdetectChanges as detectChanges,
  ɵmarkDirty as markDirty,
} from '@angular/core';
import { hasZone, isIvy } from '../utils';
import { mapTo } from 'rxjs/operators';

/** A shared promise instance to cause a delay of one microtask */
let resolvedPromise: Promise<void> | null = null;

function getResolvedPromise() {
  resolvedPromise = resolvedPromise || Promise.resolve();
  return resolvedPromise;
}

function getSaveDurationSelector(ngZone: NgZone): () => Observable<number> {
  return () => defer(getResolvedPromise).pipe(mapTo(1));
  // @Notice this part of the code is in the coalescing PR https://github.com/ngrx/platform/pull/2456
  /* hasZone(ngZone)
      ? generateFrames(
          (window as any).__zone_symbol__requestAnimationFrame,
          (window as any).__zone_symbol__cancelAnimationFrame
        )
      : generateFrames();*/
}

export interface StrategyFactoryConfig {
  component: any;
  ngZone: NgZone;
  cdRef: ChangeDetectorRef;
}

export interface CdStrategy<T> {
  behaviour: (cfg?: any) => MonoTypeOperatorFunction<T>;
  render: () => void;
  name: string;
}

export const DEFAULT_STRATEGY_NAME = 'idle';

export interface StrategySelection<U> {
  idle: CdStrategy<U>;

  [key: string]: CdStrategy<U>;
}

export function getStrategies<T>(
  cfg: StrategyFactoryConfig
): StrategySelection<T> {
  return {
    idle: createIdleStrategy<T>(cfg),
    noop: createNoopStrategy<T>(),
    pessimistic1: createPessimistic1Strategy<T>(cfg),
    pessimistic2: createPessimistic2Strategy<T>(cfg),
    optimistic1: createOptimistic1Strategy<T>(cfg),
    optimistic2: createOptimistic2Strategy<T>(cfg),
  };
}

/**
 * Idle Strategy
 *
 * This strategy is the drop-in replacement for Angular's built-in `async` pipe.
 * This is the only strategy that **does not also work in zone-less environments**.
 *
 * - \>=ViewEngine
 * |          | Render Method      | Coalescing | Coalesce Scope |
 * | -------- | -------------------| ---------- | -------------- |
 * | ZoneFull | cdRef.markForCheck | ❌         | None           |
 * | ZoneLess | cdRef.markForCheck | ❌         | None           |
 *
 * - Ivy
 *
 * |          | Render Method      | Coalescing | Coalesce Scope |
 * | -------- | -------------------| ---------- | -------------- |
 * | ZoneFull | cdRef.markForCheck | ❌         | None           |
 * | ZoneLess | cdRef.markForCheck | ❌         | None           |
 */
export function createIdleStrategy<T>(
  cfg: Pick<StrategyFactoryConfig, 'cdRef' | 'component'>
): CdStrategy<T> {
  return {
    render: (): void => {
      isIvy() ? markDirty(cfg.component) : cfg.cdRef.markForCheck();
    },
    behaviour: () => o => o,
    name: 'idle',
  };
}

/**
 * Noop Strategy
 *
 * This strategy is does nothing.
 *
 * - \>=ViewEngine
 * |          | Render Method      | Coalescing | Coalesce Scope |
 * | -------- | -------------------| ---------- | -------------- |
 * | ZoneFull | None               | ❌         | None           |
 * | ZoneLess | None               | ❌         | None           |
 *
 * - Ivy
 *
 * |          | Render Method      | Coalescing | Coalesce Scope |
 * | -------- | -------------------| ---------- | -------------- |
 * | ZoneFull | None               | ❌         | None           |
 * | ZoneLess | None               | ❌         | None           |
 */
export function createNoopStrategy<T>(cfg?: any): CdStrategy<T> {
  return {
    render: (): void => {},
    behaviour: () => o => o,
    name: 'noop',
  };
}

/**
 *
 * Pessimistic1 Strategy
 *
 * This strategy is providing only Angular built-in features.
 *  If Ivy is present it uses the latest methods as they are.
 *
 * - \>=ViewEngine
 *
 * |          | Render Method      | Coalescing | Coalesce Scope |
 * | -------- | -------------------| ---------- | -------------- |
 * | ZoneFull | cdRef.markForCheck | ❌         | None           |
 * | ZoneLess | cdRef.detectChange | ✔️         | None           |
 *
 * - Ivy
 *
 * |          | Render Method      | Coalescing | Coalesce Scope |
 * | -------- | -------------------| ---------- | -------------- |
 * | ZoneFull | ɵmarkDirty         | ❌         | None           |
 * | ZoneLess | ɵmarkDirty         | ❌         | None           |
 */
export function createPessimistic1Strategy<T>(
  cfg: StrategyFactoryConfig
): CdStrategy<T> {
  const inIvy = isIvy();
  const inZone = hasZone(cfg.ngZone);
  const durationSelector = getSaveDurationSelector(cfg.ngZone);

  function render() {
    if (inZone && !inIvy) {
      cfg.cdRef.markForCheck();
    } else if (!inZone && !inIvy) {
      cfg.cdRef.detectChanges();
    } else {
      markDirty(cfg.component);
    }
  }

  const behaviour = (o$: Observable<T>): Observable<T> => {
    return !inZone && !inIvy
      ? o$
          .pipe
          // @Notice this part of the code is in the coalescing PR https://github.com/ngrx/platform/pull/2456
          // coalesce(durationSelector)
          ()
      : o$;
  };

  return {
    behaviour: () => behaviour,
    render,
    name: 'pessimistic1',
  };
}

/**
 *  Pessimistic2 Strategy
 *
 * This strategy is providing only Angular built-in features and optimized behavior in the ZoneLess environment.
 * If Ivy is present it uses the latest methods as they are.
 *
 * - \>=ViewEngine
 *
 *  |          | Render Method      | Coalescing | Coalesce Scope |
 * | -------- | -------------------| ---------- | -------------- |
 * | ZoneFull | cdRef.markForCheck | ❌         | None           |
 * | ZoneLess | cdRef.detectChange | ✔️         | Component      |
 *
 * - Ivy
 *
 * |          | Render Method      | Coalescing | Coalesce Scope |
 * | -------- | -------------------| ---------- | -------------- |
 * | ZoneFull | ɵmarkDirty         | ❌         | None           |
 * | ZoneLess | ɵmarkDirty         | ❌         | None           |
 */
export function createPessimistic2Strategy<T>(
  cfg: StrategyFactoryConfig
): CdStrategy<T> {
  const inIvy = isIvy();
  const inZone = hasZone(cfg.ngZone);
  const durationSelector = getSaveDurationSelector(cfg.ngZone);
  const coalesceConfig = { context: cfg.component as any };

  function render() {
    if (inZone && !inIvy) {
      cfg.cdRef.markForCheck();
    } else if (!inZone && !inIvy) {
      cfg.cdRef.detectChanges();
    } else {
      markDirty(cfg.component);
    }
  }

  const behaviour = (o$: Observable<T>): Observable<T> => {
    return !inZone && !inIvy
      ? o$
          .pipe
          // @Notice this part of the code is in the coalescing PR https://github.com/ngrx/platform/pull/2456
          // coalesce(durationSelector, coalesceConfig)
          ()
      : o$;
  };

  return {
    behaviour: () => behaviour,
    render,
    name: 'pessimistic2',
  };
}

/**
 * Optimistic1 Strategy
 *
 *  - \>=ViewEngine
 *
 *  |          | Render Method      | Coalescing | Coalesce Scope |
 * | -------- | -------------------| ---------- | -------------- |
 * | ZoneFull | cdRef.markForCheck | ❌         | None           |
 * | ZoneLess | cdRef.detectChange | ✔️         | Component      |
 *
 *  - Ivy
 *
 *  |          | Render Method      | Coalescing | Coalesce Scope |
 * | -------- | -------------------| ---------- | -------------- |
 * | ZoneFull | ɵmarkDirty         | ❌         | None           |
 * | ZoneLess | ɵdetectChanges     | ✔️         | LView          |
 */
export function createOptimistic1Strategy<T>(
  cfg: StrategyFactoryConfig
): CdStrategy<T> {
  const inIvy = isIvy();
  const inZone = hasZone(cfg.ngZone);
  const durationSelector = getSaveDurationSelector(cfg.ngZone);

  function render() {
    if (inIvy) {
      if (inZone) {
        markDirty(cfg.component);
      } else {
        detectChanges(cfg.component);
      }
    } else {
      if (inZone) {
        cfg.cdRef.markForCheck();
      } else {
        cfg.cdRef.detectChanges();
      }
    }
  }

  const coalesceConfig = {
    context: inIvy
      ? (cfg.cdRef as any)._lView
      : ((cfg.cdRef as any).context as any),
  };

  const behaviour = (o$: Observable<T>): Observable<T> => {
    return inZone
      ? o$
          .pipe
          // @Notice this part of the code is in the coalescing PR https://github.com/ngrx/platform/pull/2456
          // coalesce(durationSelector, coalesceConfig)
          ()
      : o$;
  };

  return {
    behaviour: () => behaviour,
    render,
    name: 'optimistic1',
  };
}

/**
 * Optimistic2 Strategy
 *
 * This strategy is then the most performing one and integrated all optimizations.
 *
 * - \>=ViewEngine
 *
 * |          | Render Method      | Coalescing | Coalesce Scope |
 * | -------- | -------------------| ---------- | -------------- |
 * | ZoneFull | cdRef.detectChange | ✔️         | Component      |
 * | ZoneLess | cdRef.detectChange | ✔️         | Component      |
 *
 * - Ivy
 *
 * |          | Render Method      | Coalescing | Coalesce Scope |
 * | -------- | -------------------| ---------- | -------------- |
 * | ZoneFull | ɵdetectChanges     | ✔️         | LView          |
 * | ZoneLess | ɵdetectChanges     | ✔️         | LView          |
 */
export function createOptimistic2Strategy<T>(
  cfg: StrategyFactoryConfig
): CdStrategy<T> {
  const inIvy = isIvy();
  const durationSelector = getSaveDurationSelector(cfg.ngZone);
  const coalesceConfig = {
    context: (inIvy ? (cfg.cdRef as any)._lView : cfg.component) as any,
  };

  const behaviour = (o$: Observable<T>): Observable<T> => {
    return o$
      .pipe
      // @Notice this part of the code is in the coalescing PR https://github.com/ngrx/platform/pull/2456
      // coalesce(durationSelector, coalesceConfig)
      ();
  };

  return {
    behaviour: () => behaviour,
    render(): void {
      inIvy ? detectChanges(cfg.component) : cfg.cdRef.detectChanges();
    },
    name: 'optimistic2',
  };
}
