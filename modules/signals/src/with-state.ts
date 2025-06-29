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
import { isWritableSignal, STATE_SOURCE, StateResult } from './state-source';

export function withState<State extends object>(
  stateFactory: () => State
): SignalStoreFeature<
  EmptyFeatureResult,
  { state: StateResult<State>; props: {}; methods: {} }
>;
export function withState<State extends object>(
  state: State
): SignalStoreFeature<
  EmptyFeatureResult,
  { state: StateResult<State>; props: {}; methods: {} }
>;
export function withState<State extends object>(
  stateOrFactory: State | (() => State)
): SignalStoreFeature<
  SignalStoreFeatureResult,
  { state: StateResult<State>; props: {}; methods: {} }
> {
  return (store) => {
    const state =
      typeof stateOrFactory === 'function' ? stateOrFactory() : stateOrFactory;
    const stateKeys = Reflect.ownKeys(state);

    assertUniqueStoreMembers(store, stateKeys);

    const stateSource = store[STATE_SOURCE] as Record<
      string | symbol,
      Signal<unknown>
    >;
    const stateSignals = {} as SignalsDictionary;
    for (const key of stateKeys) {
      const signalOrValue = (state as Record<string | symbol, unknown>)[key];
      stateSource[key] = isWritableSignal(signalOrValue)
        ? signalOrValue
        : signal(signalOrValue);
      stateSignals[key] = toDeepSignal(stateSource[key]);
    }

    return {
      ...store,
      stateSignals: { ...store.stateSignals, ...stateSignals },
    } as InnerSignalStore<StateResult<State>>;
  };
}
