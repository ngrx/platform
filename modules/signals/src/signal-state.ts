import { signal, WritableSignal } from '@angular/core';
import { DeepSignal, toDeepSignal } from './deep-signal';
import { defaultEqual } from './select-signal';
import { HasFunctionKeys } from './ts-helpers';

export const STATE_SIGNAL = Symbol('STATE_SIGNAL');

export type SignalStateMeta<State extends Record<string, unknown>> = {
  [STATE_SIGNAL]: WritableSignal<State>;
};

type SignalStateCheck<State> = HasFunctionKeys<State> extends false | undefined
  ? unknown
  : '@ngrx/signals: signal state properties must be different from `Function` properties';

type SignalState<State extends Record<string, unknown>> = DeepSignal<State> &
  SignalStateMeta<State>;

export function signalState<State extends Record<string, unknown>>(
  initialState: State & SignalStateCheck<State>
): SignalState<State> {
  const stateSignal = signal(initialState as State, { equal: defaultEqual });
  const deepSignal = toDeepSignal(stateSignal.asReadonly());
  Object.defineProperty(deepSignal, STATE_SIGNAL, {
    value: stateSignal,
  });

  return deepSignal as SignalState<State>;
}
