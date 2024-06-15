import { computed } from '@angular/core';
import { toDeepSignal } from './deep-signal';
import { excludeKeys } from './helpers';
import { STATE_SIGNAL } from './state-signal';
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

    const stateSignals = stateKeys.reduce((acc, key) => {
      const sliceSignal = computed(
        () => (store[STATE_SIGNAL]() as Record<string, unknown>)[key]
      );
      return { ...acc, [key]: toDeepSignal(sliceSignal) };
    }, {} as SignalsDictionary);
    const computedSignals = excludeKeys(store.computedSignals, stateKeys);
    const methods = excludeKeys(store.methods, stateKeys);

    return {
      ...store,
      stateSignals: { ...store.stateSignals, ...stateSignals },
      computedSignals,
      methods,
    } as InnerSignalStore<State>;
  };
}
