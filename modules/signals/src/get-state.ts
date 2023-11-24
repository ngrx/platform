import { STATE_SIGNAL, StateSignal } from './state-signal';

export function getState<State extends object>(
  stateSignal: StateSignal<State>
): State {
  return stateSignal[STATE_SIGNAL]();
}
