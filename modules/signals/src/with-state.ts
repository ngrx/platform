import { computed } from '@angular/core';
import { toDeepSignal } from './deep-signal';
import { excludeKeys } from './helpers';
import { STATE_SIGNAL } from './signal-state';
import {
  EmptyFeatureResult,
  InnerSignalStore,
  SignalsDictionary,
  SignalStoreFeature,
  SignalStoreFeatureResult,
} from './signal-store-models';

export function withState<State extends object>(
  stateFactory: () => State
): SignalStoreFeature<
  EmptyFeatureResult,
  EmptyFeatureResult & { state: State }
>;
export function withState<State extends object>(
  state: State
): SignalStoreFeature<
  EmptyFeatureResult,
  EmptyFeatureResult & { state: State }
>;
export function withState<State extends object>(
  stateOrFactory: State | (() => State)
): SignalStoreFeature<
  SignalStoreFeatureResult,
  EmptyFeatureResult & { state: State }
> {
  return (store) => {
    const state =
      typeof stateOrFactory === 'function' ? stateOrFactory() : stateOrFactory;
    const stateKeys = Object.keys(state);

    store[STATE_SIGNAL].update((currentState) => ({
      ...currentState,
      ...state,
    }));

    const slices = stateKeys.reduce((acc, key) => {
      const slice = computed(
        () => (store[STATE_SIGNAL]() as Record<string, unknown>)[key]
      );
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
