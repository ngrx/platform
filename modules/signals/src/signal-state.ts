import { computed, signal } from '@angular/core';
import { DeepSignal, toDeepSignal } from './deep-signal';
import { SignalsDictionary } from './signal-store-models';
import { STATE_SOURCE, WritableStateSource } from './state-source';

export type SignalState<State extends object> = DeepSignal<State> &
  WritableStateSource<State>;

/**
 * @description
 *
 * Creates a state container with deeply nested signals for each property that
 * is an object literal.
 *
 * @usageNotes
 *
 * ```ts
 * import { Component } from '@angular/core';
 * import { signalState, patchState } from '@ngrx/signals';
 *
 * \@Component(...)
 * export class Counter {
 *   readonly state = signalState({ count: 0 });
 *
 *   logCount(): void {
 *     console.log(this.state.count());
 *   }
 *
 *   increment(): void {
 *     patchState(this.state, ({ count }) => ({ count: count + 1 }));
 *   }
 * }
 * ```
 */
export function signalState<State extends object>(
  initialState: State
): SignalState<State> {
  const stateKeys = Reflect.ownKeys(initialState);

  const stateSource = stateKeys.reduce(
    (signalsDict, key) => ({
      ...signalsDict,
      [key]: signal((initialState as Record<string | symbol, unknown>)[key]),
    }),
    {} as SignalsDictionary
  );

  const signalState = computed(() =>
    stateKeys.reduce(
      (state, key) => ({ ...state, [key]: stateSource[key]() }),
      {}
    )
  );

  Object.defineProperty(signalState, STATE_SOURCE, {
    value: stateSource,
  });

  for (const key of stateKeys) {
    Object.defineProperty(signalState, key, {
      value: toDeepSignal(stateSource[key]),
    });
  }

  return signalState as SignalState<State>;
}
