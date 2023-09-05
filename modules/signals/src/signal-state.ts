import { signal, WritableSignal } from '@angular/core';
import { DeepSignal, toDeepSignal } from './deep-signal';
import { defaultEqual } from './select-signal';

export const SIGNAL_STATE_META_KEY = Symbol('SIGNAL_STATE_META_KEY');

export type SignalStateMeta<State extends Record<string, unknown>> = {
  [SIGNAL_STATE_META_KEY]: WritableSignal<State>;
};

type SignalState<State extends Record<string, unknown>> = DeepSignal<State> &
  SignalStateMeta<State>;

/**
 * Signal state cannot contain optional properties.
 */
type NotAllowedStateCheck<State> = State extends Required<State>
  ? State extends Record<string, unknown>
    ? { [K in keyof State]: State[K] & NotAllowedStateCheck<State[K]> }
    : unknown
  : never;

export function signalState<State extends Record<string, unknown>>(
  initialState: State & NotAllowedStateCheck<State>
): SignalState<State> {
  const stateSignal = signal(initialState as State, { equal: defaultEqual });
  const deepSignal = toDeepSignal(stateSignal.asReadonly());
  Object.defineProperty(deepSignal, SIGNAL_STATE_META_KEY, {
    value: stateSignal,
  });

  return deepSignal as SignalState<State>;
}
