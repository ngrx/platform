// @Notice this part of the code is in the coalescing PR https://github.com/ngrx/platform/pull/2456
// import { generateFrames } from '../projections/generateFrames';
// import { coalesce } from '../operators/coalesce';
import { defer, MonoTypeOperatorFunction, Observable } from 'rxjs';
import {
  ChangeDetectorRef,
  ɵdetectChanges as detectChanges,
  ɵmarkDirty as markDirty,
} from '@angular/core';
import { hasZone, isIvy } from '../utils';
import { mapTo } from 'rxjs/operators';

/** A shared promise instance to cause a delay of one microtask */
let resolvedPromise: Promise<void> | null = null;

function getResolvedPromise(): Promise<void> {
  resolvedPromise =
    resolvedPromise || hasZone()
      ? ((window as any).__zone_symbol__Promise.resolve() as Promise<void>)
      : Promise.resolve();
  return resolvedPromise;
}

function getSaveDurationSelector(): () => Observable<number> {
  return () => defer(getResolvedPromise).pipe(mapTo(1));
}

export interface StrategyFactoryConfig {
  component: any;
  cdRef: ChangeDetectorRef;
}

export interface CdStrategy<T> {
  behaviour: (cfg?: any) => MonoTypeOperatorFunction<T>;
  render: () => void;
  name: string;
}

export const DEFAULT_STRATEGY_NAME = 'asyncLike';

export interface StrategySelection<U> {
  asyncLike: CdStrategy<U>;

  [key: string]: CdStrategy<U>;
}

export function getStrategies<T>(
  cfg: StrategyFactoryConfig
): StrategySelection<T> {
  return {
    asyncLike: createIdleStrategy<T>(cfg),
    noop: createNoopStrategy<T>(),
    global: createGlobalStrategy<T>(cfg),
    local: createLocalStrategy<T>(cfg),
  };
}

/**
 * AsyncLike Strategy
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
    name: 'asyncLike',
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
 * Global Strategy
 *
 * This strategy is leveraging the bottom up rendering approach.
 *
 */
export function createGlobalStrategy<T>(
  cfg: StrategyFactoryConfig
): CdStrategy<T> {
  const inIvy = isIvy();
  function render() {
    if (!inIvy) {
      cfg.cdRef.markForCheck();
    } else {
      markDirty(cfg.component);
    }
  }

  const behaviour = () => (o$: Observable<T>): Observable<T> => o$;

  return {
    behaviour,
    render,
    name: 'global',
  };
}

/**
 *  Local Strategy
 *
 * This strategy is leveraging the top down rendering approach.
 *
 */
export function createLocalStrategy<T>(
  cfg: StrategyFactoryConfig
): CdStrategy<T> {
  const inIvy = isIvy();
  const inZone = hasZone();
  const durationSelector = getSaveDurationSelector();
  const coalesceConfig = { context: cfg.component as any };

  function render() {
    if (!inIvy) {
      cfg.cdRef.detectChanges();
    } else {
      detectChanges(cfg.component);
    }
  }

  const behaviour = () => (o$: Observable<T>): Observable<T> => {
    return !inZone && !inIvy
      ? o$
          .pipe
          // @Notice this part of the code is in the coalescing PR https://github.com/ngrx/platform/pull/2456
          // coalesce(durationSelector, coalesceConfig)
          ()
      : o$;
  };

  return {
    behaviour,
    render,
    name: 'local',
  };
}
