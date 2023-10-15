import { toDeepSignal } from './deep-signal';
import { excludeKeys } from './helpers';
import { patchState } from './patch-state';
import { selectSignal } from './select-signal';
import { SignalStateInput, STATE_SIGNAL } from './signal-state';
import {
  EmptyFeatureResult,
  InnerSignalStore,
  SignalsDictionary,
  SignalStoreFeature,
  SignalStoreFeatureResult,
} from './signal-store-models';

/**
 * Root state slices cannot be optional.
 */
type WithStateInput<State> = State & {} extends Required<State>
  ? keyof State extends never
    ? State
    : { [K in keyof State]: SignalStateInput<State[K]> }
  : '@ngrx/signals: state cannot contain optional properties';

export function withState<State extends Record<string, unknown>>(
  state: WithStateInput<State>
): SignalStoreFeature<
  EmptyFeatureResult,
  EmptyFeatureResult & { state: State }
>;
export function withState<State extends Record<string, unknown>>(
  stateFactory: () => WithStateInput<State>
): SignalStoreFeature<
  EmptyFeatureResult,
  EmptyFeatureResult & { state: State }
>;
export function withState<State extends Record<string, unknown>>(
  stateOrFactory: State | (() => State)
): SignalStoreFeature<
  SignalStoreFeatureResult,
  EmptyFeatureResult & { state: State }
> {
  return (store) => {
    const state =
      typeof stateOrFactory === 'function' ? stateOrFactory() : stateOrFactory;
    const stateKeys = Object.keys(state);

    patchState(store, state);

    const slices = stateKeys.reduce((acc, key) => {
      const slice = selectSignal(() => store[STATE_SIGNAL]()[key]);
      return { ...acc, [key]: toDeepSignal(slice) };
    }, {} as SignalsDictionary);
    const signals = excludeKeys(store.signals, stateKeys);
    const methods = excludeKeys(store.methods, stateKeys);

    return {
      ...store,
      slices: { ...store.slices, ...slices },
      signals,
      methods,
    } as InnerSignalStore<State>;
  };
}
