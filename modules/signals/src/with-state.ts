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

/**
 * Adds state to a signal store using a factory function.
 *
 * @param stateFactory - A factory function that returns the initial state.
 * @returns A signal store feature that adds the state.
 *
 * @public
 */
export function withState<State extends object>(
  stateFactory: () => State
): SignalStoreFeature<
  EmptyFeatureResult,
  { state: State; props: {}; methods: {} }
>;
/**
 * Adds state to a signal store using a static state object.
 *
 * @param state - The initial state object.
 * @returns A signal store feature that adds the state.
 *
 * @public
 */
export function withState<State extends object>(
  state: State
): SignalStoreFeature<
  EmptyFeatureResult,
  { state: State; props: {}; methods: {} }
>;
/**
 * @public
 */
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

    assertUniqueStoreMembers(store, stateKeys);

    const stateSource = store[STATE_SOURCE] as Record<
      string | symbol,
      Signal<unknown>
    >;
    const stateSignals: SignalsDictionary = {};

    for (const key of stateKeys) {
      stateSource[key] = signal(state[key]);
      stateSignals[key] = toDeepSignal(stateSource[key]);
    }

    return {
      ...store,
      stateSignals: { ...store.stateSignals, ...stateSignals },
    } as InnerSignalStore<State>;
  };
}
