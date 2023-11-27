import { STATE_SIGNAL, StateSignal } from './state-signal';

export type PartialStateUpdater<State extends object> = (
  state: State
) => Partial<State>;

export function patchState<State extends object>(
  stateSignal: StateSignal<State>,
  ...updaters: Array<Partial<State & {}> | PartialStateUpdater<State & {}>>
): void {
  stateSignal[STATE_SIGNAL].update((currentState) =>
    updaters.reduce(
      (nextState: State, updater) => ({
        ...nextState,
        ...(typeof updater === 'function' ? updater(nextState) : updater),
      }),
      currentState
    )
  );
}
