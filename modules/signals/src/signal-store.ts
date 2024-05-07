import { DestroyRef, inject, Injectable, signal, Type } from '@angular/core';
import { STATE_SIGNAL, StateSignal } from './state-signal';
import {
  EmptyFeatureResult,
  InnerSignalStore,
  MergeFeatureResults,
  SignalStoreConfig,
  SignalStoreFeature,
  SignalStoreFeatureResult,
  SignalStoreProps,
} from './signal-store-models';
import { Prettify } from './ts-helpers';

// @ts-ignore
export function signalStore<F1 extends SignalStoreFeatureResult>(
  f1: SignalStoreFeature<EmptyFeatureResult, F1>
): Type<SignalStoreProps<F1> & StateSignal<Prettify<F1['state']>>>;
export function signalStore<
  F1 extends SignalStoreFeatureResult,
  F2 extends SignalStoreFeatureResult,
  R extends SignalStoreFeatureResult = MergeFeatureResults<[F1, F2]>
>(
  f1: SignalStoreFeature<EmptyFeatureResult, F1>,
  f2: SignalStoreFeature<{} & F1, F2>
): Type<SignalStoreProps<R> & StateSignal<Prettify<R['state']>>>;
export function signalStore<
  F1 extends SignalStoreFeatureResult,
  F2 extends SignalStoreFeatureResult,
  F3 extends SignalStoreFeatureResult,
  R extends SignalStoreFeatureResult = MergeFeatureResults<[F1, F2, F3]>
>(
  f1: SignalStoreFeature<EmptyFeatureResult, F1>,
  f2: SignalStoreFeature<{} & F1, F2>,
  f3: SignalStoreFeature<MergeFeatureResults<[F1, F2]>, F3>
): Type<SignalStoreProps<R> & StateSignal<Prettify<R['state']>>>;
export function signalStore<
  F1 extends SignalStoreFeatureResult,
  F2 extends SignalStoreFeatureResult,
  F3 extends SignalStoreFeatureResult,
  F4 extends SignalStoreFeatureResult,
  R extends SignalStoreFeatureResult = MergeFeatureResults<[F1, F2, F3, F4]>
>(
  f1: SignalStoreFeature<EmptyFeatureResult, F1>,
  f2: SignalStoreFeature<{} & F1, F2>,
  f3: SignalStoreFeature<MergeFeatureResults<[F1, F2]>, F3>,
  f4: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3]>, F4>
): Type<SignalStoreProps<R> & StateSignal<Prettify<R['state']>>>;
export function signalStore<
  F1 extends SignalStoreFeatureResult,
  F2 extends SignalStoreFeatureResult,
  F3 extends SignalStoreFeatureResult,
  F4 extends SignalStoreFeatureResult,
  F5 extends SignalStoreFeatureResult,
  R extends SignalStoreFeatureResult = MergeFeatureResults<[F1, F2, F3, F4, F5]>
>(
  f1: SignalStoreFeature<EmptyFeatureResult, F1>,
  f2: SignalStoreFeature<{} & F1, F2>,
  f3: SignalStoreFeature<MergeFeatureResults<[F1, F2]>, F3>,
  f4: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3]>, F4>,
  f5: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4]>, F5>
): Type<SignalStoreProps<R> & StateSignal<Prettify<R['state']>>>;
export function signalStore<
  F1 extends SignalStoreFeatureResult,
  F2 extends SignalStoreFeatureResult,
  F3 extends SignalStoreFeatureResult,
  F4 extends SignalStoreFeatureResult,
  F5 extends SignalStoreFeatureResult,
  F6 extends SignalStoreFeatureResult,
  R extends SignalStoreFeatureResult = MergeFeatureResults<
    [F1, F2, F3, F4, F5, F6]
  >
>(
  f1: SignalStoreFeature<EmptyFeatureResult, F1>,
  f2: SignalStoreFeature<{} & F1, F2>,
  f3: SignalStoreFeature<MergeFeatureResults<[F1, F2]>, F3>,
  f4: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3]>, F4>,
  f5: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4]>, F5>,
  f6: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5]>, F6>
): Type<SignalStoreProps<R> & StateSignal<Prettify<R['state']>>>;
export function signalStore<
  F1 extends SignalStoreFeatureResult,
  F2 extends SignalStoreFeatureResult,
  F3 extends SignalStoreFeatureResult,
  F4 extends SignalStoreFeatureResult,
  F5 extends SignalStoreFeatureResult,
  F6 extends SignalStoreFeatureResult,
  F7 extends SignalStoreFeatureResult,
  R extends SignalStoreFeatureResult = MergeFeatureResults<
    [F1, F2, F3, F4, F5, F6, F7]
  >
>(
  f1: SignalStoreFeature<EmptyFeatureResult, F1>,
  f2: SignalStoreFeature<{} & F1, F2>,
  f3: SignalStoreFeature<MergeFeatureResults<[F1, F2]>, F3>,
  f4: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3]>, F4>,
  f5: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4]>, F5>,
  f6: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5]>, F6>,
  f7: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6]>, F7>
): Type<SignalStoreProps<R> & StateSignal<Prettify<R['state']>>>;
export function signalStore<
  F1 extends SignalStoreFeatureResult,
  F2 extends SignalStoreFeatureResult,
  F3 extends SignalStoreFeatureResult,
  F4 extends SignalStoreFeatureResult,
  F5 extends SignalStoreFeatureResult,
  F6 extends SignalStoreFeatureResult,
  F7 extends SignalStoreFeatureResult,
  F8 extends SignalStoreFeatureResult,
  R extends SignalStoreFeatureResult = MergeFeatureResults<
    [F1, F2, F3, F4, F5, F6, F7, F8]
  >
>(
  f1: SignalStoreFeature<EmptyFeatureResult, F1>,
  f2: SignalStoreFeature<{} & F1, F2>,
  f3: SignalStoreFeature<MergeFeatureResults<[F1, F2]>, F3>,
  f4: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3]>, F4>,
  f5: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4]>, F5>,
  f6: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5]>, F6>,
  f7: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6]>, F7>,
  f8: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7]>, F8>
): Type<SignalStoreProps<R> & StateSignal<Prettify<R['state']>>>;
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
  R extends SignalStoreFeatureResult = MergeFeatureResults<
    [F1, F2, F3, F4, F5, F6, F7, F8, F9]
  >
>(
  f1: SignalStoreFeature<EmptyFeatureResult, F1>,
  f2: SignalStoreFeature<{} & F1, F2>,
  f3: SignalStoreFeature<MergeFeatureResults<[F1, F2]>, F3>,
  f4: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3]>, F4>,
  f5: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4]>, F5>,
  f6: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5]>, F6>,
  f7: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6]>, F7>,
  f8: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7]>, F8>,
  f9: SignalStoreFeature<
    MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8]>,
    F9
  >
): Type<SignalStoreProps<R> & StateSignal<Prettify<R['state']>>>;

export function signalStore<F1 extends SignalStoreFeatureResult>(
  config: SignalStoreConfig,
  f1: SignalStoreFeature<EmptyFeatureResult, F1>
): Type<SignalStoreProps<F1> & StateSignal<Prettify<F1['state']>>>;
export function signalStore<
  F1 extends SignalStoreFeatureResult,
  F2 extends SignalStoreFeatureResult,
  R extends SignalStoreFeatureResult = MergeFeatureResults<[F1, F2]>
>(
  config: SignalStoreConfig,
  f1: SignalStoreFeature<EmptyFeatureResult, F1>,
  f2: SignalStoreFeature<{} & F1, F2>
): Type<SignalStoreProps<R> & StateSignal<Prettify<R['state']>>>;
export function signalStore<
  F1 extends SignalStoreFeatureResult,
  F2 extends SignalStoreFeatureResult,
  F3 extends SignalStoreFeatureResult,
  R extends SignalStoreFeatureResult = MergeFeatureResults<[F1, F2, F3]>
>(
  config: SignalStoreConfig,
  f1: SignalStoreFeature<EmptyFeatureResult, F1>,
  f2: SignalStoreFeature<{} & F1, F2>,
  f3: SignalStoreFeature<MergeFeatureResults<[F1, F2]>, F3>
): Type<SignalStoreProps<R> & StateSignal<Prettify<R['state']>>>;
export function signalStore<
  F1 extends SignalStoreFeatureResult,
  F2 extends SignalStoreFeatureResult,
  F3 extends SignalStoreFeatureResult,
  F4 extends SignalStoreFeatureResult,
  R extends SignalStoreFeatureResult = MergeFeatureResults<[F1, F2, F3, F4]>
>(
  config: SignalStoreConfig,
  f1: SignalStoreFeature<EmptyFeatureResult, F1>,
  f2: SignalStoreFeature<{} & F1, F2>,
  f3: SignalStoreFeature<MergeFeatureResults<[F1, F2]>, F3>,
  f4: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3]>, F4>
): Type<SignalStoreProps<R> & StateSignal<Prettify<R['state']>>>;
export function signalStore<
  F1 extends SignalStoreFeatureResult,
  F2 extends SignalStoreFeatureResult,
  F3 extends SignalStoreFeatureResult,
  F4 extends SignalStoreFeatureResult,
  F5 extends SignalStoreFeatureResult,
  R extends SignalStoreFeatureResult = MergeFeatureResults<[F1, F2, F3, F4, F5]>
>(
  config: SignalStoreConfig,
  f1: SignalStoreFeature<EmptyFeatureResult, F1>,
  f2: SignalStoreFeature<{} & F1, F2>,
  f3: SignalStoreFeature<MergeFeatureResults<[F1, F2]>, F3>,
  f4: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3]>, F4>,
  f5: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4]>, F5>
): Type<SignalStoreProps<R> & StateSignal<Prettify<R['state']>>>;
export function signalStore<
  F1 extends SignalStoreFeatureResult,
  F2 extends SignalStoreFeatureResult,
  F3 extends SignalStoreFeatureResult,
  F4 extends SignalStoreFeatureResult,
  F5 extends SignalStoreFeatureResult,
  F6 extends SignalStoreFeatureResult,
  R extends SignalStoreFeatureResult = MergeFeatureResults<
    [F1, F2, F3, F4, F5, F6]
  >
>(
  config: SignalStoreConfig,
  f1: SignalStoreFeature<EmptyFeatureResult, F1>,
  f2: SignalStoreFeature<{} & F1, F2>,
  f3: SignalStoreFeature<MergeFeatureResults<[F1, F2]>, F3>,
  f4: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3]>, F4>,
  f5: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4]>, F5>,
  f6: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5]>, F6>
): Type<SignalStoreProps<R> & StateSignal<Prettify<R['state']>>>;
export function signalStore<
  F1 extends SignalStoreFeatureResult,
  F2 extends SignalStoreFeatureResult,
  F3 extends SignalStoreFeatureResult,
  F4 extends SignalStoreFeatureResult,
  F5 extends SignalStoreFeatureResult,
  F6 extends SignalStoreFeatureResult,
  F7 extends SignalStoreFeatureResult,
  R extends SignalStoreFeatureResult = MergeFeatureResults<
    [F1, F2, F3, F4, F5, F6, F7]
  >
>(
  config: SignalStoreConfig,
  f1: SignalStoreFeature<EmptyFeatureResult, F1>,
  f2: SignalStoreFeature<{} & F1, F2>,
  f3: SignalStoreFeature<MergeFeatureResults<[F1, F2]>, F3>,
  f4: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3]>, F4>,
  f5: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4]>, F5>,
  f6: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5]>, F6>,
  f7: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6]>, F7>
): Type<SignalStoreProps<R> & StateSignal<Prettify<R['state']>>>;
export function signalStore<
  F1 extends SignalStoreFeatureResult,
  F2 extends SignalStoreFeatureResult,
  F3 extends SignalStoreFeatureResult,
  F4 extends SignalStoreFeatureResult,
  F5 extends SignalStoreFeatureResult,
  F6 extends SignalStoreFeatureResult,
  F7 extends SignalStoreFeatureResult,
  F8 extends SignalStoreFeatureResult,
  R extends SignalStoreFeatureResult = MergeFeatureResults<
    [F1, F2, F3, F4, F5, F6, F7, F8]
  >
>(
  config: SignalStoreConfig,
  f1: SignalStoreFeature<EmptyFeatureResult, F1>,
  f2: SignalStoreFeature<{} & F1, F2>,
  f3: SignalStoreFeature<MergeFeatureResults<[F1, F2]>, F3>,
  f4: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3]>, F4>,
  f5: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4]>, F5>,
  f6: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5]>, F6>,
  f7: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6]>, F7>,
  f8: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7]>, F8>
): Type<SignalStoreProps<R> & StateSignal<Prettify<R['state']>>>;
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
  R extends SignalStoreFeatureResult = MergeFeatureResults<
    [F1, F2, F3, F4, F5, F6, F7, F8, F9]
  >
>(
  config: SignalStoreConfig,
  f1: SignalStoreFeature<EmptyFeatureResult, F1>,
  f2: SignalStoreFeature<{} & F1, F2>,
  f3: SignalStoreFeature<MergeFeatureResults<[F1, F2]>, F3>,
  f4: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3]>, F4>,
  f5: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4]>, F5>,
  f6: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5]>, F6>,
  f7: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6]>, F7>,
  f8: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7]>, F8>,
  f9: SignalStoreFeature<
    MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8]>,
    F9
  >
): Type<SignalStoreProps<R> & StateSignal<Prettify<R['state']>>>;
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
  F10 extends SignalStoreFeatureResult,
  R extends SignalStoreFeatureResult = MergeFeatureResults<
    [F1, F2, F3, F4, F5, F6, F7, F8, F10]
  >
>(
  config: SignalStoreConfig,
  f1: SignalStoreFeature<EmptyFeatureResult, F1>,
  f2: SignalStoreFeature<{} & F1, F2>,
  f3: SignalStoreFeature<MergeFeatureResults<[F1, F2]>, F3>,
  f4: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3]>, F4>,
  f5: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4]>, F5>,
  f6: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5]>, F6>,
  f7: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6]>, F7>,
  f8: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7]>, F8>,
  f9: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8]>, F9>,
  f10: SignalStoreFeature<
    MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8, F9]>,
    F10
  >
): Type<SignalStoreProps<R> & StateSignal<Prettify<R['state']>>>;
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
  F10 extends SignalStoreFeatureResult,
  F11 extends SignalStoreFeatureResult,
  R extends SignalStoreFeatureResult = MergeFeatureResults<
    [F1, F2, F3, F4, F5, F6, F7, F8, F10, F11]
  >
>(
  config: SignalStoreConfig,
  f1: SignalStoreFeature<EmptyFeatureResult, F1>,
  f2: SignalStoreFeature<{} & F1, F2>,
  f3: SignalStoreFeature<MergeFeatureResults<[F1, F2]>, F3>,
  f4: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3]>, F4>,
  f5: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4]>, F5>,
  f6: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5]>, F6>,
  f7: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6]>, F7>,
  f8: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7]>, F8>,
  f9: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8]>, F9>,
  f10: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8, F9]>, F10>,
  f11: SignalStoreFeature<
    MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8, F9, F10]>,
    F11
  >
): Type<SignalStoreProps<R> & StateSignal<Prettify<R['state']>>>;
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
  F10 extends SignalStoreFeatureResult,
  F11 extends SignalStoreFeatureResult,
  F12 extends SignalStoreFeatureResult,
  R extends SignalStoreFeatureResult = MergeFeatureResults<
    [F1, F2, F3, F4, F5, F6, F7, F8, F10, F11, F12]
  >
>(
  config: SignalStoreConfig,
  f1: SignalStoreFeature<EmptyFeatureResult, F1>,
  f2: SignalStoreFeature<{} & F1, F2>,
  f3: SignalStoreFeature<MergeFeatureResults<[F1, F2]>, F3>,
  f4: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3]>, F4>,
  f5: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4]>, F5>,
  f6: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5]>, F6>,
  f7: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6]>, F7>,
  f8: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7]>, F8>,
  f9: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8]>, F9>,
  f10: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8, F9]>, F10>,
  f11: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8, F9, F10]>, F11>,
  f12: SignalStoreFeature<
    MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11]>,
    F12
  >
): Type<SignalStoreProps<R> & StateSignal<Prettify<R['state']>>>;
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
  F10 extends SignalStoreFeatureResult,
  F11 extends SignalStoreFeatureResult,
  F12 extends SignalStoreFeatureResult,
  F13 extends SignalStoreFeatureResult,
  R extends SignalStoreFeatureResult = MergeFeatureResults<
    [F1, F2, F3, F4, F5, F6, F7, F8, F10, F11, F12, F13]
  >
>(
  config: SignalStoreConfig,
  f1: SignalStoreFeature<EmptyFeatureResult, F1>,
  f2: SignalStoreFeature<{} & F1, F2>,
  f3: SignalStoreFeature<MergeFeatureResults<[F1, F2]>, F3>,
  f4: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3]>, F4>,
  f5: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4]>, F5>,
  f6: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5]>, F6>,
  f7: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6]>, F7>,
  f8: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7]>, F8>,
  f9: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8]>, F9>,
  f10: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8, F9]>, F10>,
  f11: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8, F9, F10]>, F11>,
  f12: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11]>, F12>,
  f13: SignalStoreFeature<
    MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11, F12]>,
    F13
  >
): Type<SignalStoreProps<R> & StateSignal<Prettify<R['state']>>>;
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
  F10 extends SignalStoreFeatureResult,
  F11 extends SignalStoreFeatureResult,
  F12 extends SignalStoreFeatureResult,
  F13 extends SignalStoreFeatureResult,
  F14 extends SignalStoreFeatureResult,
  R extends SignalStoreFeatureResult = MergeFeatureResults<
    [F1, F2, F3, F4, F5, F6, F7, F8, F10, F11, F12, F13, F14]
  >
>(
  config: SignalStoreConfig,
  f1: SignalStoreFeature<EmptyFeatureResult, F1>,
  f2: SignalStoreFeature<{} & F1, F2>,
  f3: SignalStoreFeature<MergeFeatureResults<[F1, F2]>, F3>,
  f4: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3]>, F4>,
  f5: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4]>, F5>,
  f6: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5]>, F6>,
  f7: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6]>, F7>,
  f8: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7]>, F8>,
  f9: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8]>, F9>,
  f10: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8, F9]>, F10>,
  f11: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8, F9, F10]>, F11>,
  f12: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11]>, F12>,
  f13: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11, F12]>, F13>,
  f14: SignalStoreFeature<
    MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11, F12, F13]>,
    F14
  >
): Type<SignalStoreProps<R> & StateSignal<Prettify<R['state']>>>;
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
  F10 extends SignalStoreFeatureResult,
  F11 extends SignalStoreFeatureResult,
  F12 extends SignalStoreFeatureResult,
  F13 extends SignalStoreFeatureResult,
  F14 extends SignalStoreFeatureResult,
  F15 extends SignalStoreFeatureResult,
  R extends SignalStoreFeatureResult = MergeFeatureResults<
    [F1, F2, F3, F4, F5, F6, F7, F8, F10, F11, F12, F13, F14, F15]
  >
>(
  config: SignalStoreConfig,
  f1: SignalStoreFeature<EmptyFeatureResult, F1>,
  f2: SignalStoreFeature<{} & F1, F2>,
  f3: SignalStoreFeature<MergeFeatureResults<[F1, F2]>, F3>,
  f4: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3]>, F4>,
  f5: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4]>, F5>,
  f6: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5]>, F6>,
  f7: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6]>, F7>,
  f8: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7]>, F8>,
  f9: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8]>, F9>,
  f10: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8, F9]>, F10>,
  f11: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8, F9, F10]>, F11>,
  f12: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11]>, F12>,
  f13: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11, F12]>, F13>,
  f14: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11, F12, F13]>, F14>,
  f15: SignalStoreFeature<
    MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11, F12, F13, F14]>,
    F15
  >
): Type<SignalStoreProps<R> & StateSignal<Prettify<R['state']>>>;
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
  F10 extends SignalStoreFeatureResult,
  F11 extends SignalStoreFeatureResult,
  F12 extends SignalStoreFeatureResult,
  F13 extends SignalStoreFeatureResult,
  F14 extends SignalStoreFeatureResult,
  F15 extends SignalStoreFeatureResult,
  F16 extends SignalStoreFeatureResult,
  R extends SignalStoreFeatureResult = MergeFeatureResults<
    [F1, F2, F3, F4, F5, F6, F7, F8, F10, F11, F12, F13, F14, F15, F16]
  >
>(
  config: SignalStoreConfig,
  f1: SignalStoreFeature<EmptyFeatureResult, F1>,
  f2: SignalStoreFeature<{} & F1, F2>,
  f3: SignalStoreFeature<MergeFeatureResults<[F1, F2]>, F3>,
  f4: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3]>, F4>,
  f5: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4]>, F5>,
  f6: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5]>, F6>,
  f7: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6]>, F7>,
  f8: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7]>, F8>,
  f9: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8]>, F9>,
  f10: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8, F9]>, F10>,
  f11: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8, F9, F10]>, F11>,
  f12: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11]>, F12>,
  f13: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11, F12]>, F13>,
  f14: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11, F12, F13]>, F14>,
  f15: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11, F12, F13, F14]>, F15>,
  f16: SignalStoreFeature<
    MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11, F12, F13, F14, F15]>,
    F16
  >
): Type<SignalStoreProps<R> & StateSignal<Prettify<R['state']>>>;
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
  F10 extends SignalStoreFeatureResult,
  F11 extends SignalStoreFeatureResult,
  F12 extends SignalStoreFeatureResult,
  F13 extends SignalStoreFeatureResult,
  F14 extends SignalStoreFeatureResult,
  F15 extends SignalStoreFeatureResult,
  F16 extends SignalStoreFeatureResult,
  F17 extends SignalStoreFeatureResult,
  R extends SignalStoreFeatureResult = MergeFeatureResults<
    [F1, F2, F3, F4, F5, F6, F7, F8, F10, F11, F12, F13, F14, F15, F16, F17]
  >
>(
  config: SignalStoreConfig,
  f1: SignalStoreFeature<EmptyFeatureResult, F1>,
  f2: SignalStoreFeature<{} & F1, F2>,
  f3: SignalStoreFeature<MergeFeatureResults<[F1, F2]>, F3>,
  f4: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3]>, F4>,
  f5: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4]>, F5>,
  f6: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5]>, F6>,
  f7: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6]>, F7>,
  f8: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7]>, F8>,
  f9: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8]>, F9>,
  f10: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8, F9]>, F10>,
  f11: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8, F9, F10]>, F11>,
  f12: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11]>, F12>,
  f13: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11, F12]>, F13>,
  f14: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11, F12, F13]>, F14>,
  f15: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11, F12, F13, F14]>, F15>,
  f16: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11, F12, F13, F14, F15]>, F16>,
  f17: SignalStoreFeature<
    MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11, F12, F13, F14, F15, F16]>,
    F17
  >
): Type<SignalStoreProps<R> & StateSignal<Prettify<R['state']>>>;
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
  F10 extends SignalStoreFeatureResult,
  F11 extends SignalStoreFeatureResult,
  F12 extends SignalStoreFeatureResult,
  F13 extends SignalStoreFeatureResult,
  F14 extends SignalStoreFeatureResult,
  F15 extends SignalStoreFeatureResult,
  F16 extends SignalStoreFeatureResult,
  F17 extends SignalStoreFeatureResult,
  F18 extends SignalStoreFeatureResult,
  R extends SignalStoreFeatureResult = MergeFeatureResults<
    [F1, F2, F3, F4, F5, F6, F7, F8, F10, F11, F12, F13, F14, F15, F16, F17, F18]
  >
>(
  config: SignalStoreConfig,
  f1: SignalStoreFeature<EmptyFeatureResult, F1>,
  f2: SignalStoreFeature<{} & F1, F2>,
  f3: SignalStoreFeature<MergeFeatureResults<[F1, F2]>, F3>,
  f4: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3]>, F4>,
  f5: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4]>, F5>,
  f6: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5]>, F6>,
  f7: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6]>, F7>,
  f8: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7]>, F8>,
  f9: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8]>, F9>,
  f10: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8, F9]>, F10>,
  f11: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8, F9, F10]>, F11>,
  f12: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11]>, F12>,
  f13: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11, F12]>, F13>,
  f14: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11, F12, F13]>, F14>,
  f15: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11, F12, F13, F14]>, F15>,
  f16: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11, F12, F13, F14, F15]>, F16>,
  f17: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11, F12, F13, F14, F15, F16]>, F17>,
  f18: SignalStoreFeature<
    MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11, F12, F13, F14, F15, F16, F17]>,
    F18
  >
): Type<SignalStoreProps<R> & StateSignal<Prettify<R['state']>>>;
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
  F10 extends SignalStoreFeatureResult,
  F11 extends SignalStoreFeatureResult,
  F12 extends SignalStoreFeatureResult,
  F13 extends SignalStoreFeatureResult,
  F14 extends SignalStoreFeatureResult,
  F15 extends SignalStoreFeatureResult,
  F16 extends SignalStoreFeatureResult,
  F17 extends SignalStoreFeatureResult,
  F18 extends SignalStoreFeatureResult,
  F19 extends SignalStoreFeatureResult,
  // @ts-ignore
  R extends SignalStoreFeatureResult = MergeFeatureResults<
    [F1, F2, F3, F4, F5, F6, F7, F8, F10, F11, F12, F13, F14, F15, F16, F17, F18, F19]
  >
>(
  config: SignalStoreConfig,
  f1: SignalStoreFeature<EmptyFeatureResult, F1>,
  f2: SignalStoreFeature<{} & F1, F2>,  
  f3: SignalStoreFeature<MergeFeatureResults<[F1, F2]>, F3>,
  f4: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3]>, F4>,
  f5: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4]>, F5>,
  f6: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5]>, F6>,
  f7: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6]>, F7>,
  f8: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7]>, F8>,
  f9: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8]>, F9>,
  f10: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8, F9]>, F10>,
  f11: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8, F9, F10]>, F11>,
  f12: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11]>, F12>,
  f13: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11, F12]>, F13>,
  f14: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11, F12, F13]>, F14>,
  f15: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11, F12, F13, F14]>, F15>,
  f16: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11, F12, F13, F14, F15]>, F16>,
  f17: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11, F12, F13, F14, F15, F16]>, F17>,
  f18: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11, F12, F13, F14, F15, F16, F17]>, F18>,
  f19: SignalStoreFeature<
    MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11, F12, F13, F14, F15, F16, F17, F18]>,
    F19
  >
): Type<SignalStoreProps<R> & StateSignal<Prettify<R['state']>>>;
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
  F10 extends SignalStoreFeatureResult,
  F11 extends SignalStoreFeatureResult,
  F12 extends SignalStoreFeatureResult,
  F13 extends SignalStoreFeatureResult,
  F14 extends SignalStoreFeatureResult,
  F15 extends SignalStoreFeatureResult,
  F16 extends SignalStoreFeatureResult,
  F17 extends SignalStoreFeatureResult,
  F18 extends SignalStoreFeatureResult,
  F19 extends SignalStoreFeatureResult,
  F20 extends SignalStoreFeatureResult,
  // @ts-ignore
  R extends SignalStoreFeatureResult = MergeFeatureResults<
    [F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11, F12, F13, F14, F15, F16, F17, F18, F19, F20]
  >
>(
  config: SignalStoreConfig,
  f1: SignalStoreFeature<EmptyFeatureResult, F1>,
  f2: SignalStoreFeature<{} & F1, F2>,
  f3: SignalStoreFeature<MergeFeatureResults<[F1, F2]>, F3>,
  f4: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3]>, F4>,
  f5: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4]>, F5>,
  f6: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5]>, F6>,
  f7: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6]>, F7>,
  f8: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7]>, F8>,
  f9: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8]>, F9>,
  f10: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8, F9]>, F10>,
  f11: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8, F9, F10]>, F11>,
  f12: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11]>, F12>,
  f13: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11, F12]>, F13>,
  f14: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11, F12, F13]>, F14>,
  f15: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11, F12, F13, F14]>, F15>,
  f16: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11, F12, F13, F14, F15]>, F16>,
  f17: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11, F12, F13, F14, F15, F16]>, F17>,
  f18: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11, F12, F13, F14, F15, F16, F17]>, F18>,
  f19: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11, F12, F13, F14, F15, F16, F17, F18]>, F19>,
  f20: SignalStoreFeature<
    MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11, F12, F13, F14, F15, F16, F17, F18, F19]>,
    F20
  >
): Type<SignalStoreProps<R> & StateSignal<Prettify<R['state']>>>;
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
  F10 extends SignalStoreFeatureResult,
  F11 extends SignalStoreFeatureResult,
  F12 extends SignalStoreFeatureResult,
  F13 extends SignalStoreFeatureResult,
  F14 extends SignalStoreFeatureResult,
  F15 extends SignalStoreFeatureResult,
  F16 extends SignalStoreFeatureResult,
  F17 extends SignalStoreFeatureResult,
  F18 extends SignalStoreFeatureResult,
  F19 extends SignalStoreFeatureResult,
  F20 extends SignalStoreFeatureResult,
  F21 extends SignalStoreFeatureResult,
  // @ts-ignore
  R extends SignalStoreFeatureResult = MergeFeatureResults<
    [F1, F2, F3, F4, F5, F6, F7, F8, F10, F11, F12, F13, F14, F15, F16, F17, F18, F19, F20, F21]
  >
>(
  config: SignalStoreConfig,
  f1: SignalStoreFeature<EmptyFeatureResult, F1>,
  f2: SignalStoreFeature<{} & F1, F2>,
  f3: SignalStoreFeature<MergeFeatureResults<[F1, F2]>, F3>,
  f4: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3]>, F4>,
  f5: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4]>, F5>,
  f6: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5]>, F6>,
  f7: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6]>, F7>,
  f8: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7]>, F8>,
  f9: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8]>, F9>,
  f10: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8, F9]>, F10>,
  f11: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8, F9, F10]>, F11>,
  f12: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11]>, F12>,
  f13: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11, F12]>, F13>,
  f14: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11, F12, F13]>, F14>,
  f15: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11, F12, F13, F14]>, F15>,
  f16: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11, F12, F13, F14, F15]>, F16>,
  f17: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11, F12, F13, F14, F15, F16]>, F17>,
  f18: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11, F12, F13, F14, F15, F16, F17]>, F18>,
  f19: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11, F12, F13, F14, F15, F16, F17, F18]>, F19>,
  f20: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11, F12, F13, F14, F15, F16, F17, F18, F19]>, F20>,
  f21: SignalStoreFeature<
    MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11, F12, F13, F14, F15, F16, F17, F18, F19, F20]>,
    F21
  >
): Type<SignalStoreProps<R> & StateSignal<Prettify<R['state']>>>;
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
  F10 extends SignalStoreFeatureResult,
  F11 extends SignalStoreFeatureResult,
  F12 extends SignalStoreFeatureResult,
  F13 extends SignalStoreFeatureResult,
  F14 extends SignalStoreFeatureResult,
  F15 extends SignalStoreFeatureResult,
  F16 extends SignalStoreFeatureResult,
  F17 extends SignalStoreFeatureResult,
  F18 extends SignalStoreFeatureResult,
  F19 extends SignalStoreFeatureResult,
  F20 extends SignalStoreFeatureResult,
  F21 extends SignalStoreFeatureResult,
  F22 extends SignalStoreFeatureResult,
  // @ts-ignore
  R extends SignalStoreFeatureResult = MergeFeatureResults<
    [F1, F2, F3, F4, F5, F6, F7, F8, F10, F11, F12, F13, F14, F15, F16, F17, F18, F19, F20, F21, F22]
  >
>(
  config: SignalStoreConfig,
  f1: SignalStoreFeature<EmptyFeatureResult, F1>,
  f2: SignalStoreFeature<{} & F1, F2>,
  f3: SignalStoreFeature<MergeFeatureResults<[F1, F2]>, F3>,
  f4: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3]>, F4>,
  f5: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4]>, F5>,
  f6: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5]>, F6>,
  f7: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6]>, F7>,
  f8: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7]>, F8>,
  f9: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8]>, F9>,
  f10: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8, F9]>, F10>,
  f11: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8, F9, F10]>, F11>,
  f12: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11]>, F12>,
  f13: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11, F12]>, F13>,
  f14: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11, F12, F13]>, F14>,
  f15: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11, F12, F13, F14]>, F15>,
  f16: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11, F12, F13, F14, F15]>, F16>,
  f17: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11, F12, F13, F14, F15, F16]>, F17>,
  f18: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11, F12, F13, F14, F15, F16, F17]>, F18>,
  f19: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11, F12, F13, F14, F15, F16, F17, F18]>, F19>,
  f20: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11, F12, F13, F14, F15, F16, F17, F18, F19]>, F20>,
  f21: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11, F12, F13, F14, F15, F16, F17, F18, F19, F20]>, F21>,
  f22: SignalStoreFeature<
    MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11, F12, F13, F14, F15, F16, F17, F18, F19, F20, F21]>,
    F22
  >
): Type<SignalStoreProps<R> & StateSignal<Prettify<R['state']>>>;
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
  F10 extends SignalStoreFeatureResult,
  F11 extends SignalStoreFeatureResult,
  F12 extends SignalStoreFeatureResult,
  F13 extends SignalStoreFeatureResult,
  F14 extends SignalStoreFeatureResult,
  F15 extends SignalStoreFeatureResult,
  F16 extends SignalStoreFeatureResult,
  F17 extends SignalStoreFeatureResult,
  F18 extends SignalStoreFeatureResult,
  F19 extends SignalStoreFeatureResult,
  F20 extends SignalStoreFeatureResult,
  F21 extends SignalStoreFeatureResult,
  F22 extends SignalStoreFeatureResult,
  F23 extends SignalStoreFeatureResult,
  // @ts-ignore
  R extends SignalStoreFeatureResult = MergeFeatureResults<
    [F1, F2, F3, F4, F5, F6, F7, F8, F10, F11, F12, F13, F14, F15, F16, F17, F18, F19, F20, F21, F22, F23]
  >
>(
  config: SignalStoreConfig,
  f1: SignalStoreFeature<EmptyFeatureResult, F1>,
  f2: SignalStoreFeature<{} & F1, F2>,
  f3: SignalStoreFeature<MergeFeatureResults<[F1, F2]>, F3>,
  f4: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3]>, F4>,
  f5: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4]>, F5>,
  f6: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5]>, F6>,
  f7: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6]>, F7>,
  f8: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7]>, F8>,
  f9: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8]>, F9>,
  f10: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8, F9]>, F10>,
  f11: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8, F9, F10]>, F11>,
  f12: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11]>, F12>,
  f13: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11, F12]>, F13>,
  f14: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11, F12, F13]>, F14>,
  f15: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11, F12, F13, F14]>, F15>,
  f16: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11, F12, F13, F14, F15]>, F16>,
  f17: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11, F12, F13, F14, F15, F16]>, F17>,
  f18: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11, F12, F13, F14, F15, F16, F17]>, F18>,
  f19: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11, F12, F13, F14, F15, F16, F17, F18]>, F19>,
  f20: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11, F12, F13, F14, F15, F16, F17, F18, F19]>, F20>,
  f21: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11, F12, F13, F14, F15, F16, F17, F18, F19, F20]>, F21>,
  f22: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11, F12, F13, F14, F15, F16, F17, F18, F19, F20, F21]>, F22>,
  f23: SignalStoreFeature<
    MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11, F12, F13, F14, F15, F16, F17, F18, F19, F20, F21, F22]>,
    F23
  >
): Type<SignalStoreProps<R> & StateSignal<Prettify<R['state']>>>;
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
  F10 extends SignalStoreFeatureResult,
  F11 extends SignalStoreFeatureResult,
  F12 extends SignalStoreFeatureResult,
  F13 extends SignalStoreFeatureResult,
  F14 extends SignalStoreFeatureResult,
  F15 extends SignalStoreFeatureResult,
  F16 extends SignalStoreFeatureResult,
  F17 extends SignalStoreFeatureResult,
  F18 extends SignalStoreFeatureResult,
  F19 extends SignalStoreFeatureResult,
  F20 extends SignalStoreFeatureResult,
  F21 extends SignalStoreFeatureResult,
  F22 extends SignalStoreFeatureResult,
  F23 extends SignalStoreFeatureResult,
  F24 extends SignalStoreFeatureResult,
  // @ts-ignore
  R extends SignalStoreFeatureResult = MergeFeatureResults<
    [F1, F2, F3, F4, F5, F6, F7, F8, F10, F11, F12, F13, F14, F15, F16, F17, F18, F19, F20, F21, F22, F23, F24]
  >
>(
  config: SignalStoreConfig,
  f1: SignalStoreFeature<EmptyFeatureResult, F1>,
  f2: SignalStoreFeature<{} & F1, F2>,
  f3: SignalStoreFeature<MergeFeatureResults<[F1, F2]>, F3>,
  f4: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3]>, F4>,
  f5: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4]>, F5>,
  f6: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5]>, F6>,
  f7: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6]>, F7>,
  f8: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7]>, F8>,
  f9: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8]>, F9>,
  f10: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8, F9]>, F10>,
  f11: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8, F9, F10]>, F11>,
  f12: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11]>, F12>,
  f13: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11, F12]>, F13>,
  f14: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11, F12, F13]>, F14>,
  f15: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11, F12, F13, F14]>, F15>,
  f16: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11, F12, F13, F14, F15]>, F16>,
  f17: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11, F12, F13, F14, F15, F16]>, F17>,
  f18: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11, F12, F13, F14, F15, F16, F17]>, F18>,
  f19: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11, F12, F13, F14, F15, F16, F17, F18]>, F19>,
  f20: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11, F12, F13, F14, F15, F16, F17, F18, F19]>, F20>,
  f21: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11, F12, F13, F14, F15, F16, F17, F18, F19, F20]>, F21>,
  f22: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11, F12, F13, F14, F15, F16, F17, F18, F19, F20, F21]>, F22>,
  f23: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11, F12, F13, F14, F15, F16, F17, F18, F19, F20, F21, F22]>, F23>,
  f24: SignalStoreFeature<
    MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11, F12, F13, F14, F15, F16, F17, F18, F19, F20, F21, F22, F23]>,
    F24
  >
): Type<SignalStoreProps<R> & StateSignal<Prettify<R['state']>>>;
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
  F10 extends SignalStoreFeatureResult,
  F11 extends SignalStoreFeatureResult,
  F12 extends SignalStoreFeatureResult,
  F13 extends SignalStoreFeatureResult,
  F14 extends SignalStoreFeatureResult,
  F15 extends SignalStoreFeatureResult,
  F16 extends SignalStoreFeatureResult,
  F17 extends SignalStoreFeatureResult,
  F18 extends SignalStoreFeatureResult,
  F19 extends SignalStoreFeatureResult,
  F20 extends SignalStoreFeatureResult,
  F21 extends SignalStoreFeatureResult,
  F22 extends SignalStoreFeatureResult,
  F23 extends SignalStoreFeatureResult,
  F24 extends SignalStoreFeatureResult,
  F25 extends SignalStoreFeatureResult,
  // @ts-ignore
  R extends SignalStoreFeatureResult = MergeFeatureResults<
    [F1, F2, F3, F4, F5, F6, F7, F8, F10, F11, F12, F13, F14, F15, F16, F17, F18, F19, F20, F21, F22, F23, F24, F25]
  >
>(
  config: SignalStoreConfig,
  f1: SignalStoreFeature<EmptyFeatureResult, F1>,
  f2: SignalStoreFeature<{} & F1, F2>,
  f3: SignalStoreFeature<MergeFeatureResults<[F1, F2]>, F3>,
  f4: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3]>, F4>,
  f5: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4]>, F5>,
  f6: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5]>, F6>,
  f7: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6]>, F7>,
  f8: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7]>, F8>,
  f9: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8]>, F9>,
  f10: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8, F9]>, F10>,
  f11: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8, F9, F10]>, F11>,
  f12: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11]>, F12>,
  f13: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11, F12]>, F13>,
  f14: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11, F12, F13]>, F14>,
  f15: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11, F12, F13, F14]>, F15>,
  f16: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11, F12, F13, F14, F15]>, F16>,
  f17: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11, F12, F13, F14, F15, F16]>, F17>,
  f18: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11, F12, F13, F14, F15, F16, F17]>, F18>,
  f19: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11, F12, F13, F14, F15, F16, F17, F18]>, F19>,
  f20: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11, F12, F13, F14, F15, F16, F17, F18, F19]>, F20>,
  f21: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11, F12, F13, F14, F15, F16, F17, F18, F19, F20]>, F21>,
  f22: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11, F12, F13, F14, F15, F16, F17, F18, F19, F20, F21]>, F22>,
  f23: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11, F12, F13, F14, F15, F16, F17, F18, F19, F20, F21, F22]>, F23>,
  f24: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11, F12, F13, F14, F15, F16, F17, F18, F19, F20, F21, F22, F23]>, F24>,
  f25: SignalStoreFeature<
    MergeFeatureResults<[F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11, F12, F13, F14, F15, F16, F17, F18, F19, F20, F21, F22, F23, F24]>,
    F25
  >
): Type<SignalStoreProps<R> & StateSignal<Prettify<R['state']>>>;

export function signalStore(
  ...args: [SignalStoreConfig, ...SignalStoreFeature[]] | SignalStoreFeature[]
): Type<SignalStoreProps<any>> {
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
      const { slices, signals, methods, hooks } = innerStore;
      const props = { ...slices, ...signals, ...methods };

      (this as any)[STATE_SIGNAL] = innerStore[STATE_SIGNAL];

      for (const key in props) {
        (this as any)[key] = props[key];
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
    [STATE_SIGNAL]: signal({}),
    slices: {},
    signals: {},
    methods: {},
    hooks: {},
  };
}
