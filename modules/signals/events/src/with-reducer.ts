import { inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { merge, tap } from 'rxjs';
import {
  EmptyFeatureResult,
  getState,
  patchState,
  SignalStoreFeature,
  signalStoreFeature,
  type,
  withHooks,
} from '@ngrx/signals';
import { CaseReducerResult } from './case-reducer';
import { Event } from './event';
import { EventCreator, EventCreatorWithProps } from './event-creator';
import { ReducerEvents } from './events';

/**
 * @experimental
 * @description
 *
 * SignalStore feature for defining state changes based on dispatched events.
 *
 * @usageNotes
 *
 * ```ts
 * import { eventCreator, on, props, withReducer } from '@ngrx/signals/events';
 *
 * const set = eventCreator('[Counter Page] Set', props<{ count: number }>());
 *
 * const CounterStore = signalStore(
 *   withState({ count: 0 }),
 *   withReducer(
 *     on(set, ({ count }) => ({ count })),
 *   ),
 * );
 * ```
 */
export function withReducer<State extends object>(
  ...caseReducers: CaseReducerResult<
    State,
    Array<EventCreator | EventCreatorWithProps>
  >[]
): SignalStoreFeature<
  { state: State; props: {}; methods: {} },
  EmptyFeatureResult
> {
  return signalStoreFeature(
    { state: type<State>() },
    withHooks({
      onInit(store, events = inject(ReducerEvents)) {
        const updates = caseReducers.map((caseReducer) =>
          events.on(...caseReducer.events).pipe(
            tap((event: Event) => {
              const state = getState(store);
              const result = caseReducer.reducer(event, state);
              const updaters = Array.isArray(result) ? result : [result];

              patchState(store, ...updaters);
            })
          )
        );

        merge(...updates)
          .pipe(takeUntilDestroyed())
          .subscribe();
      },
    })
  );
}
