import { computed, signal } from '@angular/core';
import { DeepSignal, toDeepSignal } from './deep-signal';
import { SignalsDictionary } from './signal-store-models';
import { STATE_SOURCE, WritableStateSource } from './state-source';

/**
 * A signal state type that combines deep signal access with writable state source functionality.
 *
 * @public
 */
export type SignalState<State extends object> = DeepSignal<State> &
  WritableStateSource<State>;

/**
 * Creates a signal state from the provided initial state.
 *
 * @param initialState - The initial state object.
 * @returns A signal state that provides reactive access to state properties.
 *
 * @public
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
