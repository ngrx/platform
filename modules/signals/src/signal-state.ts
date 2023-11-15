import { signal, WritableSignal } from '@angular/core';
import { DeepSignal, toDeepSignal } from './deep-signal';

export const STATE_SIGNAL = Symbol('STATE_SIGNAL');

export type SignalStateMeta<State extends Record<string, any>> = {
  [STATE_SIGNAL]: WritableSignal<State>;
};

type SignalState<State extends Record<string, any>> = DeepSignal<State> &
  SignalStateMeta<State>;

export function signalState<State extends Record<string, any>>(
  initialState: State
): SignalState<State> {
  const stateSignal = signal(initialState as State);
  const deepSignal = toDeepSignal(stateSignal.asReadonly());
  Object.defineProperty(deepSignal, STATE_SIGNAL, {
    value: stateSignal,
  });

  return deepSignal as SignalState<State>;
}
