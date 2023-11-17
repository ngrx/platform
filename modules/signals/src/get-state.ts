import { STATE_SIGNAL, SignalStateMeta } from './signal-state';

export function getState<State extends object>(
  signalState: SignalStateMeta<State>
): State {
  return signalState[STATE_SIGNAL]();
}
