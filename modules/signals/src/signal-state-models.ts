import { DeepSignal } from './deep-signal';

export type SignalState<State extends Record<string, unknown>> =
  DeepSignal<State> & SignalStateUpdate<State>;

export type SignalStateUpdater<State extends Record<string, unknown>> =
  | Partial<State>
  | ((state: State) => Partial<State>);

export type SignalStateUpdate<State extends Record<string, unknown>> = {
  $update: (...updaters: SignalStateUpdater<State>[]) => void;
};

/**
 * Signal state cannot contain optional properties.
 */
export type NotAllowedStateCheck<State> = State extends Required<State>
  ? State extends Record<string, unknown>
    ? { [K in keyof State]: State[K] & NotAllowedStateCheck<State[K]> }
    : unknown
  : never;
