import { signal, WritableSignal } from '@angular/core';
import { toDeepSignal } from './deep-signal';
import { defaultEqual } from './select-signal';
import {
  NotAllowedStateCheck,
  SignalState,
  SignalStateUpdate,
} from './signal-state-models';

export function signalState<State extends Record<string, unknown>>(
  initialState: State & NotAllowedStateCheck<State>
): SignalState<State> {
  const stateSignal = signal(initialState as State, { equal: defaultEqual });
  const deepSignal = toDeepSignal(stateSignal.asReadonly());
  (deepSignal as SignalState<State>).$update =
    signalStateUpdateFactory(stateSignal);

  return deepSignal as SignalState<State>;
}

export function signalStateUpdateFactory<State extends Record<string, unknown>>(
  stateSignal: WritableSignal<State>
): SignalStateUpdate<State>['$update'] {
  return (...updaters) =>
    stateSignal.update((state) =>
      updaters.reduce(
        (currentState: State, updater) => ({
          ...currentState,
          ...(typeof updater === 'function' ? updater(currentState) : updater),
        }),
        state
      )
    );
}
