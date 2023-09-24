import { signal, WritableSignal } from '@angular/core';
import { DeepSignal, toDeepSignal } from './deep-signal';
import { defaultEqual } from './select-signal';

export const STATE_SIGNAL = Symbol('STATE_SIGNAL');

export type SignalStateMeta<State extends Record<string, unknown>> = {
  [STATE_SIGNAL]: WritableSignal<State>;
};

/**
 * Signal state cannot contain optional properties.
 */
export type NotAllowedStateCheck<State> = State extends Required<State>
  ? State extends Record<string, unknown>
    ? { [K in keyof State]: State[K] & NotAllowedStateCheck<State[K]> }
    : unknown
  : never;

type SignalState<State extends Record<string, unknown>> = DeepSignal<State> &
  SignalStateMeta<State>;

export function signalState<State extends Record<string, unknown>>(
  initialState: State & NotAllowedStateCheck<State>
): SignalState<State> {
  const stateSignal = signal(initialState as State, { equal: defaultEqual });
  const deepSignal = toDeepSignal(stateSignal.asReadonly());
  Object.defineProperty(deepSignal, STATE_SIGNAL, {
    value: stateSignal,
  });

  return deepSignal as SignalState<State>;
}
