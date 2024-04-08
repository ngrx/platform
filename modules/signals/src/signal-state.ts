import { signal } from '@angular/core';
import { STATE_SIGNAL, StateSignal } from './state-signal';
import { DeepSignal, toDeepSignal } from './deep-signal';

export type SignalState<State extends object> = DeepSignal<State> & StateSignal<State>;

export function signalState<State extends object>(
  initialState: State
): SignalState<State> {
  const stateSignal = signal(initialState as State);
  const deepSignal = toDeepSignal(stateSignal.asReadonly());
  Object.defineProperty(deepSignal, STATE_SIGNAL, {
    value: stateSignal,
  });

  return deepSignal as SignalState<State>;
}
