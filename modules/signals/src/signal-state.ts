import { computed, signal } from '@angular/core';
import { DeepSignal, toDeepSignal } from './deep-signal';
import { SignalsDictionary } from './signal-store-models';
import {
  isWritableSignal,
  STATE_SOURCE,
  StateResult,
  WritableStateSource,
} from './state-source';

export type SignalState<State extends object> = DeepSignal<StateResult<State>> &
  WritableStateSource<StateResult<State>>;

export function signalState<State extends object>(
  initialState: State
): SignalState<State> {
  const stateKeys = Reflect.ownKeys(initialState);

  const stateSource = stateKeys.reduce((signalsDict, key) => {
    const signalOrValue = (initialState as Record<string | symbol, unknown>)[
      key
    ];
    return {
      ...signalsDict,
      [key]: isWritableSignal(signalOrValue)
        ? signalOrValue
        : signal(signalOrValue),
    };
  }, {} as SignalsDictionary);

  const signalState = computed(() =>
    stateKeys.reduce(
      (state, key) => ({
        ...state,
        [key]: stateSource[key](),
      }),
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
