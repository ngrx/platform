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
} from '@ngrx/signals';
import { Dispatcher } from './dispatcher';
import { isEvent } from './event';
import { SOURCE_TYPE } from './events';

/**
 * @experimental
 * @description
 *
 * SignalStore feature for defining side effects.
 *
 * @usageNotes
 *
 * ```ts
 * import { eventCreator, Events, withEffects } from '@ngrx/signals/events';
 *
 * const increment = eventCreator('[Counter Page] Increment');
 * const decrement = eventCreator('[Counter Page] Decrement');
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
    store: Prettify<StateSignals<Input['state']> & Input['props']>
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
              if (isEvent(value) && !(SOURCE_TYPE in value)) {
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
