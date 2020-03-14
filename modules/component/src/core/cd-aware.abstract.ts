import { ChangeDetectorRef, NgZone } from '@angular/core';
import { getChangeDetectionHandler } from './utils';
import {
  NextObserver,
  Observable,
  PartialObserver,
  Subject,
  Subscription,
} from 'rxjs';
import { distinctUntilChanged, map, switchAll, tap } from 'rxjs/operators';
import { toObservableValue } from './projections';

export interface CoalescingConfig {
  optimized: boolean;
}

export interface CdAware<U> {
  next: (v: Observable<U> | Promise<U> | null | undefined) => void;
  subscribe: () => Subscription;
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
  cdRef: ChangeDetectorRef;
  ngZone: NgZone;
  context: any;
  resetContextObserver: NextObserver<unknown>;
  updateViewContextObserver: PartialObserver<U | null | undefined>;
  configurableBehaviour: (o: Observable<any>) => Observable<any>;
}): CdAware<U> {
  const _render: <T>(component?: T) => void = getChangeDetectionHandler(
    cfg.ngZone,
    cfg.cdRef
  );
  const _observablesSubject = new Subject<
    Observable<U> | Promise<U> | null | undefined
  >();
  // We have to defer the setup of observables$ until subscription as getConfigurableBehaviour is defined in the
  // extending class. So getConfigurableBehaviour is not available in the abstract layer
  const _observables$ = _observablesSubject.pipe(
    // Ignore potential observables of the same instances
    distinctUntilChanged(),
    // Try to convert it to values, throw if not possible
    map(v => toObservableValue(v)),
    // Add behaviour to apply changes to context for new observables
    tap(v => {
      cfg.resetContextObserver.next(v);
      _render(cfg.context);
    }),
    // Add behaviour to apply configurable behaviour
    cfg.configurableBehaviour,
    // Add behaviour to apply changes to context for new values
    map(value$ =>
      value$.pipe(
        tap(cfg.updateViewContextObserver),
        tap(() => _render(cfg.context))
      )
    ),
    // Unsubscribe from previous observables
    // Then flatten the latest internal observables into the output
    // @NOTICE applied behaviour (on the values, not the observable) will fire here
    switchAll(),
    // reduce number of emissions to distinct values compared to the previous one
    distinctUntilChanged()
  );

  function next(v: Observable<U> | Promise<U> | null | undefined) {
    _observablesSubject.next(v);
  }

  function subscribe(): Subscription {
    return _observables$.subscribe();
  }

  return {
    next,
    subscribe,
  };
}
