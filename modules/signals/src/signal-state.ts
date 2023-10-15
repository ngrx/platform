import { signal, WritableSignal } from '@angular/core';
import { DeepSignal, toDeepSignal } from './deep-signal';
import { defaultEqual } from './select-signal';

export const STATE_SIGNAL = Symbol('STATE_SIGNAL');

export type SignalStateMeta<State extends Record<string, unknown>> = {
  [STATE_SIGNAL]: WritableSignal<State>;
};

/**
 * State cannot contain properties that exist on the `Function` object
 * because `Signal` is a function.
 */
export type SignalStateInput<State> = State extends Record<string, unknown>
  ? ContainsFunctionProps<State> extends false
    ? { [K in keyof State]: SignalStateInput<State[K]> }
    : '@ngrx/signals: state cannot contain `Function` properties'
  : State;

type ContainsFunctionProps<State> = Exclude<
  {
    [K in keyof State]: K extends keyof Function ? true : false;
  }[keyof State],
  undefined
>;

type SignalState<State extends Record<string, unknown>> = DeepSignal<State> &
  SignalStateMeta<State>;

export function signalState<State extends Record<string, unknown>>(
  initialState: SignalStateInput<State>
): SignalState<State> {
  const stateSignal = signal(initialState as State, { equal: defaultEqual });
  const deepSignal = toDeepSignal(stateSignal.asReadonly());
  Object.defineProperty(deepSignal, STATE_SIGNAL, {
    value: stateSignal,
  });

  return deepSignal as SignalState<State>;
}
