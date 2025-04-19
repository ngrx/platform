import { Signal, signal } from '@angular/core';
import { toDeepSignal } from './deep-signal';
import { assertUniqueStoreMembers } from './signal-store-assertions';
import {
  EmptyFeatureResult,
  InnerSignalStore,
  SignalsDictionary,
  SignalStoreFeature,
  SignalStoreFeatureResult,
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
    const state =
      typeof stateOrFactory === 'function' ? stateOrFactory() : stateOrFactory;
    const stateKeys = Reflect.ownKeys(state);

    assertUniqueStoreMembers(store, stateKeys);

    const stateAsRecord = state as Record<string | symbol, unknown>;
    const stateSource = store[STATE_SOURCE] as Record<
      string | symbol,
      Signal<unknown>
    >;
    const stateSignals = {} as SignalsDictionary;
    for (const key of stateKeys) {
      const signalValue = stateAsRecord[key];
      stateSource[key] = signal(signalValue);
      stateSignals[key] = toDeepSignal(stateSource[key]);
    }

    return {
      ...store,
      stateSignals: { ...store.stateSignals, ...stateSignals },
    } as InnerSignalStore<State>;
  };
}
