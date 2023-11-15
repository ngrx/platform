import { STATE_SIGNAL, SignalStateMeta } from './signal-state';

export function getState<State extends Record<string, any>>(
  signalState: SignalStateMeta<State>
): State {
  return signalState[STATE_SIGNAL]();
}
