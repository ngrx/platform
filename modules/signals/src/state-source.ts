import { Signal, WritableSignal } from '@angular/core';
import { Prettify } from './ts-helpers';

export const STATE_SOURCE = Symbol('STATE_SOURCE');

export type WritableStateSource<State extends object> = {
  [STATE_SOURCE]: WritableSignal<State>;
};

export type StateSource<State extends object> = {
  [STATE_SOURCE]: Signal<State>;
};

export type PartialStateUpdater<State extends object> = (
  state: State
) => Partial<State>;

export function patchState<State extends object>(
  stateSource: WritableStateSource<State>,
  ...updaters: Array<
    Partial<Prettify<State>> | PartialStateUpdater<Prettify<State>>
  >
): void {
  stateSource[STATE_SOURCE].update((currentState) =>
    updaters.reduce(
      (nextState: State, updater) => ({
        ...nextState,
        ...(typeof updater === 'function' ? updater(nextState) : updater),
      }),
      currentState
    )
  );
}

export function getState<State extends object>(
  stateSource: StateSource<State>
): State {
  return stateSource[STATE_SOURCE]();
}
