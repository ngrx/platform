import { signal, WritableSignal } from '@angular/core';
import { DeepSignal, toDeepSignal } from './deep-signal';
import { defaultEqual } from './select-signal';

type SignalState<State extends Record<string, unknown>> = DeepSignal<State> &
  SignalStateMeta<State>;

const SIGNAL_STATE_META_KEY = Symbol('SIGNAL_STATE_META_KEY');

type SignalStateMeta<State extends Record<string, unknown>> = {
  [SIGNAL_STATE_META_KEY]: WritableSignal<State>;
};

/**
 * Signal state cannot contain optional properties.
 */
type NotAllowedStateCheck<State> = State extends Required<State>
  ? State extends Record<string, unknown>
    ? { [K in keyof State]: State[K] & NotAllowedStateCheck<State[K]> }
    : unknown
  : never;

export type PartialStateUpdater<State extends Record<string, unknown>> =
  | Partial<State>
  | ((state: State) => Partial<State>);

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

export function patchState<State extends Record<string, unknown>>(
  signalState: SignalStateMeta<State>,
  ...updaters: PartialStateUpdater<State>[]
): void {
  signalState[SIGNAL_STATE_META_KEY].update((currentState) =>
    updaters.reduce(
      (nextState: State, updater) => ({
        ...nextState,
        ...(typeof updater === 'function' ? updater(nextState) : updater),
      }),
      currentState
    )
  );
}
