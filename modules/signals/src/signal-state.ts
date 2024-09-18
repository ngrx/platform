import { signal } from '@angular/core';
import { STATE_SOURCE, WritableStateSource } from './state-source';
import { DeepSignal, toDeepSignal } from './deep-signal';
import { freezeInDevMode } from './deep-freeze';

export type SignalState<State extends object> = DeepSignal<State> &
  WritableStateSource<State>;

export function signalState<State extends object>(
  initialState: State
): SignalState<State> {
  const stateSource = signal(freezeInDevMode(initialState as State));
  const signalState = toDeepSignal(stateSource.asReadonly());
  Object.defineProperty(signalState, STATE_SOURCE, {
    value: stateSource,
  });

  return signalState as SignalState<State>;
}
