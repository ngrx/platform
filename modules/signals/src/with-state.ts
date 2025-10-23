import { signal } from '@angular/core';
import { toDeepSignal } from './deep-signal';
import { assertUniqueStoreMembers } from './signal-store-assertions';
import {
  EmptyFeatureResult,
  InnerSignalStore,
  SignalsDictionary,
  SignalStoreFeature,
  SignalStoreFeatureResult,
  WritableSignalsDictionary,
} from './signal-store-models';
import { STATE_SOURCE } from './state-source';

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
    const state = (
      typeof stateOrFactory === 'function' ? stateOrFactory() : stateOrFactory
    ) as Record<string | symbol, unknown>;
    const stateKeys = Reflect.ownKeys(state);

    if (typeof ngDevMode !== 'undefined' && ngDevMode) {
      assertUniqueStoreMembers(store, stateKeys);
    }

    const stateSource = store[STATE_SOURCE] as WritableSignalsDictionary;
    const stateSignals: SignalsDictionary = {};

    for (const key of stateKeys) {
      stateSource[key] = signal(state[key]);
      stateSignals[key] = toDeepSignal(stateSource[key].asReadonly());
    }

    return {
      ...store,
      stateSignals: { ...store.stateSignals, ...stateSignals },
    } as InnerSignalStore<State>;
  };
}
