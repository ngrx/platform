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
 * @description
 *
 * SignalStore feature for defining event handlers.
 *
 * @usageNotes
 *
 * ```ts
 * import { signalStore, withState } from '@ngrx/signals';
 * import { event, Events, withEventHandlers } from '@ngrx/signals/events';
 *
 * const increment = event('[Counter Page] Increment');
 * const decrement = event('[Counter Page] Decrement');
 *
 * const CounterStore = signalStore(
 *   withState({ count: 0 }),
 *   withEventHandlers(({ count }, events = inject(Events)) => ({
 *     logCount$: events.on(increment, decrement).pipe(
 *       tap(({ type }) => console.log(type, count())),
 *     ),
 *   })),
 * );
 * ```
 */
export function withEventHandlers<Input extends SignalStoreFeatureResult>(
  handlersFactory: (
    store: Prettify<
      StateSignals<Input['state']> &
        Input['props'] &
        Input['methods'] &
        WritableStateSource<Prettify<Input['state']>>
    >
  ) => Record<string, Observable<unknown>> | Observable<unknown>[]
): SignalStoreFeature<Input, EmptyFeatureResult> {
  return signalStoreFeature(
    type<Input>(),
    withHooks({
      onInit(store, dispatcher = inject(Dispatcher)) {
        const handlerSources = handlersFactory(store);
        const handlers = Object.values(handlerSources).map((handlerSource$) =>
          handlerSource$.pipe(
            tap((result) => {
              const [potentialEvent, config] = Array.isArray(result)
                ? result
                : [result];

              if (
                isEventInstance(potentialEvent) &&
                !(SOURCE_TYPE in potentialEvent)
              ) {
                dispatcher.dispatch(potentialEvent, config);
              }
            })
          )
        );

        merge(...handlers)
          .pipe(takeUntilDestroyed())
          .subscribe();
      },
    })
  );
}
