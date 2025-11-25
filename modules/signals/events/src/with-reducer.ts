import { inject, untracked } from '@angular/core';
import { tap } from 'rxjs';
import {
  EmptyFeatureResult,
  getState,
  patchState,
  SignalStoreFeature,
  signalStoreFeature,
  type,
} from '@ngrx/signals';
import { CaseReducerResult } from './case-reducer';
import { EventCreator } from './event-creator';
import { ReducerEvents } from './events-service';
import { withEventHandlers } from './with-event-handlers';

/**
 * @description
 *
 * SignalStore feature for defining state transitions based on dispatched events.
 *
 * @usageNotes
 *
 * ```ts
 * import { signalStore, type, withState } from '@ngrx/signals';
 * import { event, on, withReducer } from '@ngrx/signals/events';
 *
 * const set = event('[Counter Page] Set', type<number>());
 *
 * const CounterStore = signalStore(
 *   withState({ count: 0 }),
 *   withReducer(
 *     on(set, ({ payload }) => ({ count: payload })),
 *   ),
 * );
 * ```
 */
export function withReducer<State extends object>(
  ...caseReducers: CaseReducerResult<State, EventCreator<string, any>[]>[]
): SignalStoreFeature<
  { state: State; props: {}; methods: {} },
  EmptyFeatureResult
> {
  return signalStoreFeature(
    { state: type<State>() },
    withEventHandlers((store, events = inject(ReducerEvents)) =>
      caseReducers.map((caseReducer) =>
        events.on(...caseReducer.events).pipe(
          tap((event) => {
            const state = untracked(() => getState(store));
            const result = caseReducer.reducer(event, state);
            const updaters = Array.isArray(result) ? result : [result];

            patchState(store, ...updaters);
          })
        )
      )
    )
  );
}
