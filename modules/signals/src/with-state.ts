import { Signal, signal, WritableSignal } from '@angular/core';
import { toDeepSignal } from './deep-signal';
import { assertUniqueStoreMembers } from './signal-store-assertions';
import {
  EmptyFeatureResult,
  InnerSignalStore,
  SignalsDictionary,
  SignalStoreFeature,
  SignalStoreFeatureResult,
} from './signal-store-models';
import { isWritableSignal, STATE_SOURCE } from './state-source';

type StripWritableSignals<State extends object> = {
  [Property in keyof State]: State[Property] extends WritableSignal<infer Type>
    ? Type
    : State[Property];
};
export function withState<State extends object>(
  stateFactory: () => State
): SignalStoreFeature<
  EmptyFeatureResult,
  { state: StripWritableSignals<State>; props: {}; methods: {} }
>;
export function withState<State extends object>(
  state: State
): SignalStoreFeature<
  EmptyFeatureResult,
  { state: StripWritableSignals<State>; props: {}; methods: {} }
>;
export function withState<State extends object>(
  stateOrFactory: State | (() => State)
): SignalStoreFeature<
  SignalStoreFeatureResult,
  { state: StripWritableSignals<State>; props: {}; methods: {} }
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
      stateSource[key] = isWritableSignal(signalValue)
        ? signalValue
        : signal(signalValue);
      stateSignals[key] = toDeepSignal(stateSource[key]);
    }

    return {
      ...store,
      stateSignals: { ...store.stateSignals, ...stateSignals },
    } as InnerSignalStore<StripWritableSignals<State>>;
  };
}
