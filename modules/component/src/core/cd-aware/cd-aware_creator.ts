import { ChangeDetectorRef, NgZone } from '@angular/core';
import {
  NextObserver,
  Observable,
  PartialObserver,
  Subject,
  Subscribable,
  Subscription,
} from 'rxjs';
import { distinctUntilChanged, map, switchAll, tap } from 'rxjs/operators';
import { toObservableValue } from '../projections';
import { getChangeDetectionHandler } from './get-change-detection-handling';

export interface CoalescingConfig {
  optimized: boolean;
}

export interface CdAware<U> extends Subscribable<U> {
  next: (value: Observable<U> | Promise<U> | null | undefined) => void;
}

export interface WorkConfig {
  context: any;
  ngZone: NgZone;
  cdRef: ChangeDetectorRef;
}

export function setUpWork(cfg: WorkConfig): () => void {
  const render: (component?: any) => void = getChangeDetectionHandler(
    cfg.ngZone,
    cfg.cdRef
  );
  return () => render(cfg.context);
}

/**
 * class CdAware
 *
 * @description
 * This abstract class holds all the shared logic for the push pipe and the let directive
 * responsible for change detection
 * If you extend this class you need to implement how the update of the rendered value happens.
 * Also custom behaviour is something you need to implement in the extending class
 */
export function createCdAware<U>(cfg: {
  work: () => void;
  resetContextObserver: NextObserver<unknown>;
  configurableBehaviour: (
    o: Observable<Observable<U | null | undefined>>
  ) => Observable<Observable<U | null | undefined>>;
  updateViewContextObserver: PartialObserver<U | null | undefined>;
}): CdAware<U | undefined | null> {
  const observablesSubject = new Subject<
    Observable<U> | Promise<U> | null | undefined
  >();
  const observables$: Observable<
    U | undefined | null
  > = observablesSubject.pipe(
    distinctUntilChanged(),
    // Try to convert it to values, throw if not possible
    map((v) => toObservableValue(v)),
    tap((v: any) => {
      cfg.resetContextObserver.next(v);
      cfg.work();
    }),
    map(value$ =>
      value$.pipe(
        distinctUntilChanged(),
        tap(cfg.updateViewContextObserver)
      )
    ),
    cfg.configurableBehaviour,
    switchAll(),
    tap(() => cfg.work())
  );

  return {
    next(value: any): void {
      observablesSubject.next(value);
    },
    subscribe(): Subscription {
      return observables$.subscribe();
    },
  } as CdAware<U | undefined | null>;
}
