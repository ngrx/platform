import { DestroyRef, inject, Injectable, signal, Type } from '@angular/core';
import { STATE_SOURCE, StateSource } from './state-source';
import {
  EmptyFeatureResult,
  InnerSignalStore,
  SignalStoreFeature,
  SignalStoreFeatureResult,
  StateSignals,
} from './signal-store-models';
import { Prettify } from './ts-helpers';

type SignalStoreConfig = { providedIn: 'root' };

type SignalStoreMembers<FeatureResult extends SignalStoreFeatureResult> =
  Prettify<
    StateSignals<FeatureResult['state']> &
      FeatureResult['computed'] &
      FeatureResult['methods']
  >;

export function signalStore<F1 extends SignalStoreFeatureResult>(
  f1: SignalStoreFeature<EmptyFeatureResult, F1>
): Type<SignalStoreMembers<F1> & StateSource<Prettify<F1['state']>>>;
export function signalStore<
  F1 extends SignalStoreFeatureResult,
  F2 extends SignalStoreFeatureResult,
  R extends SignalStoreFeatureResult = F1 & F2
>(
  f1: SignalStoreFeature<EmptyFeatureResult, F1>,
  f2: SignalStoreFeature<{} & F1, F2>
): Type<SignalStoreMembers<R> & StateSource<Prettify<R['state']>>>;
export function signalStore<
  F1 extends SignalStoreFeatureResult,
  F2 extends SignalStoreFeatureResult,
  F3 extends SignalStoreFeatureResult,
  R extends SignalStoreFeatureResult = F1 & F2 & F3
>(
  f1: SignalStoreFeature<EmptyFeatureResult, F1>,
  f2: SignalStoreFeature<{} & F1, F2>,
  f3: SignalStoreFeature<F1 & F2, F3>
): Type<SignalStoreMembers<R> & StateSource<Prettify<R['state']>>>;
export function signalStore<
  F1 extends SignalStoreFeatureResult,
  F2 extends SignalStoreFeatureResult,
  F3 extends SignalStoreFeatureResult,
  F4 extends SignalStoreFeatureResult,
  R extends SignalStoreFeatureResult = F1 & F2 & F3 & F4
>(
  f1: SignalStoreFeature<EmptyFeatureResult, F1>,
  f2: SignalStoreFeature<{} & F1, F2>,
  f3: SignalStoreFeature<F1 & F2, F3>,
  f4: SignalStoreFeature<F1 & F2 & F3, F4>
): Type<SignalStoreMembers<R> & StateSource<Prettify<R['state']>>>;
export function signalStore<
  F1 extends SignalStoreFeatureResult,
  F2 extends SignalStoreFeatureResult,
  F3 extends SignalStoreFeatureResult,
  F4 extends SignalStoreFeatureResult,
  F5 extends SignalStoreFeatureResult,
  R extends SignalStoreFeatureResult = F1 & F2 & F3 & F4 & F5
>(
  f1: SignalStoreFeature<EmptyFeatureResult, F1>,
  f2: SignalStoreFeature<{} & F1, F2>,
  f3: SignalStoreFeature<F1 & F2, F3>,
  f4: SignalStoreFeature<F1 & F2 & F3, F4>,
  f5: SignalStoreFeature<F1 & F2 & F3 & F4, F5>
): Type<SignalStoreMembers<R> & StateSource<Prettify<R['state']>>>;
export function signalStore<
  F1 extends SignalStoreFeatureResult,
  F2 extends SignalStoreFeatureResult,
  F3 extends SignalStoreFeatureResult,
  F4 extends SignalStoreFeatureResult,
  F5 extends SignalStoreFeatureResult,
  F6 extends SignalStoreFeatureResult,
  R extends SignalStoreFeatureResult = F1 & F2 & F3 & F4 & F5 & F6
>(
  f1: SignalStoreFeature<EmptyFeatureResult, F1>,
  f2: SignalStoreFeature<{} & F1, F2>,
  f3: SignalStoreFeature<F1 & F2, F3>,
  f4: SignalStoreFeature<F1 & F2 & F3, F4>,
  f5: SignalStoreFeature<F1 & F2 & F3 & F4, F5>,
  f6: SignalStoreFeature<F1 & F2 & F3 & F4 & F5, F6>
): Type<SignalStoreMembers<R> & StateSource<Prettify<R['state']>>>;
export function signalStore<
  F1 extends SignalStoreFeatureResult,
  F2 extends SignalStoreFeatureResult,
  F3 extends SignalStoreFeatureResult,
  F4 extends SignalStoreFeatureResult,
  F5 extends SignalStoreFeatureResult,
  F6 extends SignalStoreFeatureResult,
  F7 extends SignalStoreFeatureResult,
  R extends SignalStoreFeatureResult = F1 & F2 & F3 & F4 & F5 & F6 & F7
>(
  f1: SignalStoreFeature<EmptyFeatureResult, F1>,
  f2: SignalStoreFeature<{} & F1, F2>,
  f3: SignalStoreFeature<F1 & F2, F3>,
  f4: SignalStoreFeature<F1 & F2 & F3, F4>,
  f5: SignalStoreFeature<F1 & F2 & F3 & F4, F5>,
  f6: SignalStoreFeature<F1 & F2 & F3 & F4 & F5, F6>,
  f7: SignalStoreFeature<F1 & F2 & F3 & F4 & F5 & F6, F7>
): Type<SignalStoreMembers<R> & StateSource<Prettify<R['state']>>>;
export function signalStore<
  F1 extends SignalStoreFeatureResult,
  F2 extends SignalStoreFeatureResult,
  F3 extends SignalStoreFeatureResult,
  F4 extends SignalStoreFeatureResult,
  F5 extends SignalStoreFeatureResult,
  F6 extends SignalStoreFeatureResult,
  F7 extends SignalStoreFeatureResult,
  F8 extends SignalStoreFeatureResult,
  R extends SignalStoreFeatureResult = F1 & F2 & F3 & F4 & F5 & F6 & F7 & F8
>(
  f1: SignalStoreFeature<EmptyFeatureResult, F1>,
  f2: SignalStoreFeature<{} & F1, F2>,
  f3: SignalStoreFeature<F1 & F2, F3>,
  f4: SignalStoreFeature<F1 & F2 & F3, F4>,
  f5: SignalStoreFeature<F1 & F2 & F3 & F4, F5>,
  f6: SignalStoreFeature<F1 & F2 & F3 & F4 & F5, F6>,
  f7: SignalStoreFeature<F1 & F2 & F3 & F4 & F5 & F6, F7>,
  f8: SignalStoreFeature<F1 & F2 & F3 & F4 & F5 & F6 & F7, F8>
): Type<SignalStoreMembers<R> & StateSource<Prettify<R['state']>>>;
export function signalStore<
  F1 extends SignalStoreFeatureResult,
  F2 extends SignalStoreFeatureResult,
  F3 extends SignalStoreFeatureResult,
  F4 extends SignalStoreFeatureResult,
  F5 extends SignalStoreFeatureResult,
  F6 extends SignalStoreFeatureResult,
  F7 extends SignalStoreFeatureResult,
  F8 extends SignalStoreFeatureResult,
  F9 extends SignalStoreFeatureResult,
  R extends SignalStoreFeatureResult = F1 &
    F2 &
    F3 &
    F4 &
    F5 &
    F6 &
    F7 &
    F8 &
    F9
>(
  f1: SignalStoreFeature<EmptyFeatureResult, F1>,
  f2: SignalStoreFeature<{} & F1, F2>,
  f3: SignalStoreFeature<F1 & F2, F3>,
  f4: SignalStoreFeature<F1 & F2 & F3, F4>,
  f5: SignalStoreFeature<F1 & F2 & F3 & F4, F5>,
  f6: SignalStoreFeature<F1 & F2 & F3 & F4 & F5, F6>,
  f7: SignalStoreFeature<F1 & F2 & F3 & F4 & F5 & F6, F7>,
  f8: SignalStoreFeature<F1 & F2 & F3 & F4 & F5 & F6 & F7, F8>,
  f9: SignalStoreFeature<F1 & F2 & F3 & F4 & F5 & F6 & F7 & F8, F9>
): Type<SignalStoreMembers<R> & StateSource<Prettify<R['state']>>>;

export function signalStore<F1 extends SignalStoreFeatureResult>(
  config: SignalStoreConfig,
  f1: SignalStoreFeature<EmptyFeatureResult, F1>
): Type<SignalStoreMembers<F1> & StateSource<Prettify<F1['state']>>>;
export function signalStore<
  F1 extends SignalStoreFeatureResult,
  F2 extends SignalStoreFeatureResult,
  R extends SignalStoreFeatureResult = F1 & F2
>(
  config: SignalStoreConfig,
  f1: SignalStoreFeature<EmptyFeatureResult, F1>,
  f2: SignalStoreFeature<{} & F1, F2>
): Type<SignalStoreMembers<R> & StateSource<Prettify<R['state']>>>;
export function signalStore<
  F1 extends SignalStoreFeatureResult,
  F2 extends SignalStoreFeatureResult,
  F3 extends SignalStoreFeatureResult,
  R extends SignalStoreFeatureResult = F1 & F2 & F3
>(
  config: SignalStoreConfig,
  f1: SignalStoreFeature<EmptyFeatureResult, F1>,
  f2: SignalStoreFeature<{} & F1, F2>,
  f3: SignalStoreFeature<F1 & F2, F3>
): Type<SignalStoreMembers<R> & StateSource<Prettify<R['state']>>>;
export function signalStore<
  F1 extends SignalStoreFeatureResult,
  F2 extends SignalStoreFeatureResult,
  F3 extends SignalStoreFeatureResult,
  F4 extends SignalStoreFeatureResult,
  R extends SignalStoreFeatureResult = F1 & F2 & F3 & F4
>(
  config: SignalStoreConfig,
  f1: SignalStoreFeature<EmptyFeatureResult, F1>,
  f2: SignalStoreFeature<{} & F1, F2>,
  f3: SignalStoreFeature<F1 & F2, F3>,
  f4: SignalStoreFeature<F1 & F2 & F3, F4>
): Type<SignalStoreMembers<R> & StateSource<Prettify<R['state']>>>;
export function signalStore<
  F1 extends SignalStoreFeatureResult,
  F2 extends SignalStoreFeatureResult,
  F3 extends SignalStoreFeatureResult,
  F4 extends SignalStoreFeatureResult,
  F5 extends SignalStoreFeatureResult,
  R extends SignalStoreFeatureResult = F1 & F2 & F3 & F4 & F5
>(
  config: SignalStoreConfig,
  f1: SignalStoreFeature<EmptyFeatureResult, F1>,
  f2: SignalStoreFeature<{} & F1, F2>,
  f3: SignalStoreFeature<F1 & F2, F3>,
  f4: SignalStoreFeature<F1 & F2 & F3, F4>,
  f5: SignalStoreFeature<F1 & F2 & F3 & F4, F5>
): Type<SignalStoreMembers<R> & StateSource<Prettify<R['state']>>>;
export function signalStore<
  F1 extends SignalStoreFeatureResult,
  F2 extends SignalStoreFeatureResult,
  F3 extends SignalStoreFeatureResult,
  F4 extends SignalStoreFeatureResult,
  F5 extends SignalStoreFeatureResult,
  F6 extends SignalStoreFeatureResult,
  R extends SignalStoreFeatureResult = F1 & F2 & F3 & F4 & F5 & F6
>(
  config: SignalStoreConfig,
  f1: SignalStoreFeature<EmptyFeatureResult, F1>,
  f2: SignalStoreFeature<{} & F1, F2>,
  f3: SignalStoreFeature<F1 & F2, F3>,
  f4: SignalStoreFeature<F1 & F2 & F3, F4>,
  f5: SignalStoreFeature<F1 & F2 & F3 & F4, F5>,
  f6: SignalStoreFeature<F1 & F2 & F3 & F4 & F5, F6>
): Type<SignalStoreMembers<R> & StateSource<Prettify<R['state']>>>;
export function signalStore<
  F1 extends SignalStoreFeatureResult,
  F2 extends SignalStoreFeatureResult,
  F3 extends SignalStoreFeatureResult,
  F4 extends SignalStoreFeatureResult,
  F5 extends SignalStoreFeatureResult,
  F6 extends SignalStoreFeatureResult,
  F7 extends SignalStoreFeatureResult,
  R extends SignalStoreFeatureResult = F1 & F2 & F3 & F4 & F5 & F6 & F7
>(
  config: SignalStoreConfig,
  f1: SignalStoreFeature<EmptyFeatureResult, F1>,
  f2: SignalStoreFeature<{} & F1, F2>,
  f3: SignalStoreFeature<F1 & F2, F3>,
  f4: SignalStoreFeature<F1 & F2 & F3, F4>,
  f5: SignalStoreFeature<F1 & F2 & F3 & F4, F5>,
  f6: SignalStoreFeature<F1 & F2 & F3 & F4 & F5, F6>,
  f7: SignalStoreFeature<F1 & F2 & F3 & F4 & F5 & F6, F7>
): Type<SignalStoreMembers<R> & StateSource<Prettify<R['state']>>>;
export function signalStore<
  F1 extends SignalStoreFeatureResult,
  F2 extends SignalStoreFeatureResult,
  F3 extends SignalStoreFeatureResult,
  F4 extends SignalStoreFeatureResult,
  F5 extends SignalStoreFeatureResult,
  F6 extends SignalStoreFeatureResult,
  F7 extends SignalStoreFeatureResult,
  F8 extends SignalStoreFeatureResult,
  R extends SignalStoreFeatureResult = F1 & F2 & F3 & F4 & F5 & F6 & F7 & F8
>(
  config: SignalStoreConfig,
  f1: SignalStoreFeature<EmptyFeatureResult, F1>,
  f2: SignalStoreFeature<{} & F1, F2>,
  f3: SignalStoreFeature<F1 & F2, F3>,
  f4: SignalStoreFeature<F1 & F2 & F3, F4>,
  f5: SignalStoreFeature<F1 & F2 & F3 & F4, F5>,
  f6: SignalStoreFeature<F1 & F2 & F3 & F4 & F5, F6>,
  f7: SignalStoreFeature<F1 & F2 & F3 & F4 & F5 & F6, F7>,
  f8: SignalStoreFeature<F1 & F2 & F3 & F4 & F5 & F6 & F7, F8>
): Type<SignalStoreMembers<R> & StateSource<Prettify<R['state']>>>;
export function signalStore<
  F1 extends SignalStoreFeatureResult,
  F2 extends SignalStoreFeatureResult,
  F3 extends SignalStoreFeatureResult,
  F4 extends SignalStoreFeatureResult,
  F5 extends SignalStoreFeatureResult,
  F6 extends SignalStoreFeatureResult,
  F7 extends SignalStoreFeatureResult,
  F8 extends SignalStoreFeatureResult,
  F9 extends SignalStoreFeatureResult,
  R extends SignalStoreFeatureResult = F1 &
    F2 &
    F3 &
    F4 &
    F5 &
    F6 &
    F7 &
    F8 &
    F9
>(
  config: SignalStoreConfig,
  f1: SignalStoreFeature<EmptyFeatureResult, F1>,
  f2: SignalStoreFeature<{} & F1, F2>,
  f3: SignalStoreFeature<F1 & F2, F3>,
  f4: SignalStoreFeature<F1 & F2 & F3, F4>,
  f5: SignalStoreFeature<F1 & F2 & F3 & F4, F5>,
  f6: SignalStoreFeature<F1 & F2 & F3 & F4 & F5, F6>,
  f7: SignalStoreFeature<F1 & F2 & F3 & F4 & F5 & F6, F7>,
  f8: SignalStoreFeature<F1 & F2 & F3 & F4 & F5 & F6 & F7, F8>,
  f9: SignalStoreFeature<F1 & F2 & F3 & F4 & F5 & F6 & F7 & F8, F9>
): Type<SignalStoreMembers<R> & StateSource<Prettify<R['state']>>>;

export function signalStore(
  ...args: [SignalStoreConfig, ...SignalStoreFeature[]] | SignalStoreFeature[]
): Type<SignalStoreMembers<any>> {
  const signalStoreArgs = [...args];

  const config: Partial<SignalStoreConfig> =
    'providedIn' in signalStoreArgs[0]
      ? (signalStoreArgs.shift() as SignalStoreConfig)
      : {};
  const features = signalStoreArgs as SignalStoreFeature[];

  @Injectable({ providedIn: config.providedIn || null })
  class SignalStore {
    constructor() {
      const innerStore = features.reduce(
        (store, feature) => feature(store),
        getInitialInnerStore()
      );
      const { stateSignals, computedSignals, methods, hooks } = innerStore;
      const storeMembers = { ...stateSignals, ...computedSignals, ...methods };

      (this as any)[STATE_SOURCE] = innerStore[STATE_SOURCE];

      for (const key in storeMembers) {
        (this as any)[key] = storeMembers[key];
      }

      const { onInit, onDestroy } = hooks;

      if (onInit) {
        onInit();
      }

      if (onDestroy) {
        inject(DestroyRef).onDestroy(onDestroy);
      }
    }
  }

  return SignalStore;
}

export function getInitialInnerStore(): InnerSignalStore {
  return {
    [STATE_SOURCE]: signal({}),
    stateSignals: {},
    computedSignals: {},
    methods: {},
    hooks: {},
  };
}
