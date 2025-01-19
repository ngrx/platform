import { computed } from '@angular/core';
import { assertUniqueStoreMembers } from './signal-store-assertions';
import { toDeepSignal } from './deep-signal';
import { STATE_SOURCE } from './state-source';
import {
  EmptyFeatureResult,
  InnerSignalStore,
  SignalsDictionary,
  SignalStoreFeature,
  SignalStoreFeatureResult,
} from './signal-store-models';
import { freezeInDevMode } from './deep-freeze';

export function withState<State extends object>(
  stateFactory: () => State
): SignalStoreFeature<
  EmptyFeatureResult,
  { state: State; props: {}; methods: {} }
>;
export function withState<State extends object>(
  state: State
): SignalStoreFeature<
  EmptyFeatureResult,
  { state: State; props: {}; methods: {} }
>;
export function withState<State extends object>(
  stateOrFactory: State | (() => State)
): SignalStoreFeature<
  SignalStoreFeatureResult,
  { state: State; props: {}; methods: {} }
> {
  return (store) => {
    const state =
      typeof stateOrFactory === 'function' ? stateOrFactory() : stateOrFactory;
    const stateKeys = Reflect.ownKeys(state);

    assertUniqueStoreMembers(store, stateKeys);

    store[STATE_SOURCE].update((currentState) =>
      freezeInDevMode({
        ...currentState,
        ...state,
      })
    );

    const stateSignals = stateKeys.reduce((acc, key) => {
      const sliceSignal = computed(
        () => (store[STATE_SOURCE]() as Record<string, unknown>)[key]
      );
      return { ...acc, [key]: toDeepSignal(sliceSignal) };
    }, {} as SignalsDictionary);

    return {
      ...store,
      stateSignals: { ...store.stateSignals, ...stateSignals },
    } as InnerSignalStore<State>;
  };
}
