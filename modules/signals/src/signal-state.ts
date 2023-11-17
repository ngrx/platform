import { signal, WritableSignal } from '@angular/core';
import { DeepSignal, toDeepSignal } from './deep-signal';

export const STATE_SIGNAL = Symbol('STATE_SIGNAL');

export type SignalStateMeta<State extends object> = {
  [STATE_SIGNAL]: WritableSignal<State>;
};

type SignalState<State extends object> = DeepSignal<State> &
  SignalStateMeta<State>;

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
