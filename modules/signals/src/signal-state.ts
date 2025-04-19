import { computed, signal } from '@angular/core';
import { DeepSignal, toDeepSignal } from './deep-signal';
import { SignalsDictionary } from './signal-store-models';
import { STATE_SOURCE, WritableStateSource } from './state-source';

export type SignalState<State extends object> = DeepSignal<State> &
  WritableStateSource<State>;

export function signalState<State extends object>(
  initialState: State
): SignalState<State> {
  const stateKeys = Reflect.ownKeys(initialState);
  const stateAsRecord = initialState as Record<string | symbol, unknown>;

  // define STATE_SOURCE property
  const stateSource = stateKeys.reduce(
    (signalsDict, key) => ({
      ...signalsDict,
      [key]: signal(stateAsRecord[key]),
    }),
    {} as SignalsDictionary
  );

  // define signalState as a computed signal of all STATE_SOURCE properties
  const signalState = computed(() =>
    stateKeys.reduce(
      (state, key) => ({
        ...state,
        [key]: stateSource[key](),
      }),
      {}
    )
  );

  // append STATE_SOURCE property to the signalState
  Object.defineProperty(signalState, STATE_SOURCE, {
    value: stateSource,
  });

  // generate deep signals
  for (const key of stateKeys) {
    Object.defineProperty(signalState, key, {
      value: toDeepSignal(stateSource[key]),
    });
  }

  return signalState as SignalState<State>;
}
