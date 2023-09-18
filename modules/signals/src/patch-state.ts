import { STATE_SIGNAL, SignalStateMeta } from './signal-state';

export type PartialStateUpdater<State extends Record<string, unknown>> =
  | Partial<State>
  | ((state: State) => Partial<State>);

export function patchState<State extends Record<string, unknown>>(
  signalState: SignalStateMeta<State>,
  ...updaters: PartialStateUpdater<State>[]
): void {
  signalState[STATE_SIGNAL].update((currentState) =>
    updaters.reduce(
      (nextState: State, updater) => ({
        ...nextState,
        ...(typeof updater === 'function' ? updater(nextState) : updater),
      }),
      currentState
    )
  );
}
