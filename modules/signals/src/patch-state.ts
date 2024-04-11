import { STATE_SIGNAL, StateSignal } from './state-signal';
import { Prettify } from './ts-helpers';

export type PartialStateUpdater<State extends object> = (
  state: State
) => Partial<State>;

export function patchState<State extends object>(
  stateSignal: StateSignal<State>,
  ...updaters: Array<
    Partial<Prettify<State>> | PartialStateUpdater<Prettify<State>>
  >
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
