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
import {
  HasNestedFunctionKeys,
  HasOptionalProps,
  IsUnknownRecord,
} from './ts-helpers';

type WithStateCheck<State> = IsUnknownRecord<State> extends true
  ? '@ngrx/signals: root state keys must be string literals'
  : HasOptionalProps<State> extends true
  ? '@ngrx/signals: root state slices cannot be optional'
  : HasNestedFunctionKeys<State> extends false | undefined
  ? unknown
  : '@ngrx/signals: nested state slices cannot contain `Function` property or method names';

export function withState<State extends Record<string, unknown>>(
  state: State & WithStateCheck<State>
): SignalStoreFeature<
  EmptyFeatureResult,
  EmptyFeatureResult & { state: State }
>;
export function withState<State extends Record<string, unknown>>(
  stateFactory: () => State & WithStateCheck<State>
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

    store[STATE_SIGNAL].update((currentState) => ({
      ...currentState,
      ...state,
    }));

    const slices = stateKeys.reduce((acc, key) => {
      const slice = computed(() => store[STATE_SIGNAL]()[key]);
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
