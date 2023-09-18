import { toDeepSignal } from './deep-signal';
import { excludeKeys } from './helpers';
import { patchState } from './patch-state';
import { selectSignal } from './select-signal';
import { NotAllowedStateCheck, STATE_SIGNAL } from './signal-state';
import {
  EmptyFeatureResult,
  InnerSignalStore,
  SignalsDictionary,
  SignalStoreFeature,
  SignalStoreFeatureResult,
} from './signal-store-models';

export function withState<State extends Record<string, unknown>>(
  state: State & NotAllowedStateCheck<State>
): SignalStoreFeature<
  EmptyFeatureResult,
  EmptyFeatureResult & {
    state: State;
  }
>;
export function withState<State extends Record<string, unknown>>(
  stateFactory: () => State & NotAllowedStateCheck<State>
): SignalStoreFeature<
  EmptyFeatureResult,
  EmptyFeatureResult & {
    state: State;
  }
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
