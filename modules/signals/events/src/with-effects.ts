import { inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { merge, Observable, tap } from 'rxjs';
import {
  EmptyFeatureResult,
  Prettify,
  signalStoreFeature,
  SignalStoreFeature,
  SignalStoreFeatureResult,
  StateSignals,
  type,
  withHooks,
  WritableStateSource,
} from '@ngrx/signals';
import { Dispatcher } from './dispatcher';
import { isEventInstance } from './event-instance';
import { SOURCE_TYPE } from './events-service';

/**
 * @experimental
 * SignalStore feature for defining side effects.
 *
 * @example
 *
 * ```ts
 * import { signalStore, withState } from '@ngrx/signals';
 * import { event, Events, withEffects } from '@ngrx/signals/events';
 *
 * const increment = event('[Counter Page] Increment');
 * const decrement = event('[Counter Page] Decrement');
 *
 * const CounterStore = signalStore(
 *   withState({ count: 0 }),
 *   withEffects(({ count }, events = inject(Events)) => ({
 *     logCount$: events.on(increment, decrement).pipe(
 *       tap(({ type }) => console.log(type, count())),
 *     ),
 *   })),
 * );
 * ```
 */
export function withEffects<Input extends SignalStoreFeatureResult>(
  effectsFactory: (
    store: Prettify<
      StateSignals<Input['state']> &
        Input['props'] &
        Input['methods'] &
        WritableStateSource<Prettify<Input['state']>>
    >
  ) => Record<string, Observable<unknown>>
): SignalStoreFeature<Input, EmptyFeatureResult> {
  return signalStoreFeature(
    type<Input>(),
    withHooks({
      onInit(store, dispatcher = inject(Dispatcher)) {
        const effectSources = effectsFactory(store);
        const effects = Object.values(effectSources).map((effectSource$) =>
          effectSource$.pipe(
            tap((value) => {
              if (isEventInstance(value) && !(SOURCE_TYPE in value)) {
                dispatcher.dispatch(value);
              }
            })
          )
        );

        merge(...effects)
          .pipe(takeUntilDestroyed())
          .subscribe();
      },
    })
  );
}
