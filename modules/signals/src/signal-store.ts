import { DestroyRef, inject, Injectable, Type } from '@angular/core';
import { STATE_SOURCE, StateSource, WritableStateSource } from './state-source';
import {
  EmptyFeatureResult,
  InnerSignalStore,
  SignalStoreFeature,
  SignalStoreFeatureResult,
  StateSignals,
} from './signal-store-models';
import { OmitPrivate, Prettify } from './ts-helpers';

type SignalStoreConfig = { providedIn?: 'root'; protectedState?: boolean };

type SignalStoreMembers<FeatureResult extends SignalStoreFeatureResult> =
  Prettify<
    OmitPrivate<
      StateSignals<FeatureResult['state']> &
        FeatureResult['props'] &
        FeatureResult['methods']
    >
  >;

export function signalStore<F1 extends SignalStoreFeatureResult>(
  f1: SignalStoreFeature<EmptyFeatureResult, F1>
): Type<
  SignalStoreMembers<F1> & StateSource<Prettify<OmitPrivate<F1['state']>>>
>;
export function signalStore<
  F1 extends SignalStoreFeatureResult,
  F2 extends SignalStoreFeatureResult,
  R extends SignalStoreFeatureResult = F1 & F2
>(
  f1: SignalStoreFeature<EmptyFeatureResult, F1>,
  f2: SignalStoreFeature<{} & F1, F2>
): Type<SignalStoreMembers<R> & StateSource<Prettify<OmitPrivate<R['state']>>>>;
export function signalStore<
  F1 extends SignalStoreFeatureResult,
  F2 extends SignalStoreFeatureResult,
  F3 extends SignalStoreFeatureResult,
  R extends SignalStoreFeatureResult = F1 & F2 & F3
>(
  f1: SignalStoreFeature<EmptyFeatureResult, F1>,
  f2: SignalStoreFeature<{} & F1, F2>,
  f3: SignalStoreFeature<F1 & F2, F3>
): Type<SignalStoreMembers<R> & StateSource<Prettify<OmitPrivate<R['state']>>>>;
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
): Type<SignalStoreMembers<R> & StateSource<Prettify<OmitPrivate<R['state']>>>>;
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
): Type<SignalStoreMembers<R> & StateSource<Prettify<OmitPrivate<R['state']>>>>;
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
): Type<SignalStoreMembers<R> & StateSource<Prettify<OmitPrivate<R['state']>>>>;
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
): Type<SignalStoreMembers<R> & StateSource<Prettify<OmitPrivate<R['state']>>>>;
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
): Type<SignalStoreMembers<R> & StateSource<Prettify<OmitPrivate<R['state']>>>>;
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
): Type<SignalStoreMembers<R> & StateSource<Prettify<OmitPrivate<R['state']>>>>;
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
  R extends SignalStoreFeatureResult = F1 &
    F2 &
    F3 &
    F4 &
    F5 &
    F6 &
    F7 &
    F8 &
    F9 &
    F10
>(
  f1: SignalStoreFeature<EmptyFeatureResult, F1>,
  f2: SignalStoreFeature<{} & F1, F2>,
  f3: SignalStoreFeature<F1 & F2, F3>,
  f4: SignalStoreFeature<F1 & F2 & F3, F4>,
  f5: SignalStoreFeature<F1 & F2 & F3 & F4, F5>,
  f6: SignalStoreFeature<F1 & F2 & F3 & F4 & F5, F6>,
  f7: SignalStoreFeature<F1 & F2 & F3 & F4 & F5 & F6, F7>,
  f8: SignalStoreFeature<F1 & F2 & F3 & F4 & F5 & F6 & F7, F8>,
  f9: SignalStoreFeature<F1 & F2 & F3 & F4 & F5 & F6 & F7 & F8, F9>,
  f10: SignalStoreFeature<F1 & F2 & F3 & F4 & F5 & F6 & F7 & F8 & F9, F10>
): Type<SignalStoreMembers<R> & StateSource<Prettify<OmitPrivate<R['state']>>>>;
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
  R extends SignalStoreFeatureResult = F1 &
    F2 &
    F3 &
    F4 &
    F5 &
    F6 &
    F7 &
    F8 &
    F9 &
    F10 &
    F11
>(
  f1: SignalStoreFeature<EmptyFeatureResult, F1>,
  f2: SignalStoreFeature<{} & F1, F2>,
  f3: SignalStoreFeature<F1 & F2, F3>,
  f4: SignalStoreFeature<F1 & F2 & F3, F4>,
  f5: SignalStoreFeature<F1 & F2 & F3 & F4, F5>,
  f6: SignalStoreFeature<F1 & F2 & F3 & F4 & F5, F6>,
  f7: SignalStoreFeature<F1 & F2 & F3 & F4 & F5 & F6, F7>,
  f8: SignalStoreFeature<F1 & F2 & F3 & F4 & F5 & F6 & F7, F8>,
  f9: SignalStoreFeature<F1 & F2 & F3 & F4 & F5 & F6 & F7 & F8, F9>,
  f10: SignalStoreFeature<F1 & F2 & F3 & F4 & F5 & F6 & F7 & F8 & F9, F10>,
  f11: SignalStoreFeature<F1 & F2 & F3 & F4 & F5 & F6 & F7 & F8 & F9 & F10, F11>
): Type<SignalStoreMembers<R> & StateSource<Prettify<OmitPrivate<R['state']>>>>;
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
  R extends SignalStoreFeatureResult = F1 &
    F2 &
    F3 &
    F4 &
    F5 &
    F6 &
    F7 &
    F8 &
    F9 &
    F10 &
    F11 &
    F12
>(
  f1: SignalStoreFeature<EmptyFeatureResult, F1>,
  f2: SignalStoreFeature<{} & F1, F2>,
  f3: SignalStoreFeature<F1 & F2, F3>,
  f4: SignalStoreFeature<F1 & F2 & F3, F4>,
  f5: SignalStoreFeature<F1 & F2 & F3 & F4, F5>,
  f6: SignalStoreFeature<F1 & F2 & F3 & F4 & F5, F6>,
  f7: SignalStoreFeature<F1 & F2 & F3 & F4 & F5 & F6, F7>,
  f8: SignalStoreFeature<F1 & F2 & F3 & F4 & F5 & F6 & F7, F8>,
  f9: SignalStoreFeature<F1 & F2 & F3 & F4 & F5 & F6 & F7 & F8, F9>,
  f10: SignalStoreFeature<F1 & F2 & F3 & F4 & F5 & F6 & F7 & F8 & F9, F10>,
  f11: SignalStoreFeature<
    F1 & F2 & F3 & F4 & F5 & F6 & F7 & F8 & F9 & F10,
    F11
  >,
  f12: SignalStoreFeature<
    F1 & F2 & F3 & F4 & F5 & F6 & F7 & F8 & F9 & F10 & F11,
    F12
  >
): Type<SignalStoreMembers<R> & StateSource<Prettify<OmitPrivate<R['state']>>>>;
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
  R extends SignalStoreFeatureResult = F1 &
    F2 &
    F3 &
    F4 &
    F5 &
    F6 &
    F7 &
    F8 &
    F9 &
    F10 &
    F11 &
    F12 &
    F13
>(
  f1: SignalStoreFeature<EmptyFeatureResult, F1>,
  f2: SignalStoreFeature<{} & F1, F2>,
  f3: SignalStoreFeature<F1 & F2, F3>,
  f4: SignalStoreFeature<F1 & F2 & F3, F4>,
  f5: SignalStoreFeature<F1 & F2 & F3 & F4, F5>,
  f6: SignalStoreFeature<F1 & F2 & F3 & F4 & F5, F6>,
  f7: SignalStoreFeature<F1 & F2 & F3 & F4 & F5 & F6, F7>,
  f8: SignalStoreFeature<F1 & F2 & F3 & F4 & F5 & F6 & F7, F8>,
  f9: SignalStoreFeature<F1 & F2 & F3 & F4 & F5 & F6 & F7 & F8, F9>,
  f10: SignalStoreFeature<F1 & F2 & F3 & F4 & F5 & F6 & F7 & F8 & F9, F10>,
  f11: SignalStoreFeature<
    F1 & F2 & F3 & F4 & F5 & F6 & F7 & F8 & F9 & F10,
    F11
  >,
  f12: SignalStoreFeature<
    F1 & F2 & F3 & F4 & F5 & F6 & F7 & F8 & F9 & F10 & F11,
    F12
  >,
  f13: SignalStoreFeature<
    F1 & F2 & F3 & F4 & F5 & F6 & F7 & F8 & F9 & F10 & F11 & F12,
    F13
  >
): Type<SignalStoreMembers<R> & StateSource<Prettify<OmitPrivate<R['state']>>>>;
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
  R extends SignalStoreFeatureResult = F1 &
    F2 &
    F3 &
    F4 &
    F5 &
    F6 &
    F7 &
    F8 &
    F9 &
    F10 &
    F11 &
    F12 &
    F13 &
    F14
>(
  f1: SignalStoreFeature<EmptyFeatureResult, F1>,
  f2: SignalStoreFeature<{} & F1, F2>,
  f3: SignalStoreFeature<F1 & F2, F3>,
  f4: SignalStoreFeature<F1 & F2 & F3, F4>,
  f5: SignalStoreFeature<F1 & F2 & F3 & F4, F5>,
  f6: SignalStoreFeature<F1 & F2 & F3 & F4 & F5, F6>,
  f7: SignalStoreFeature<F1 & F2 & F3 & F4 & F5 & F6, F7>,
  f8: SignalStoreFeature<F1 & F2 & F3 & F4 & F5 & F6 & F7, F8>,
  f9: SignalStoreFeature<F1 & F2 & F3 & F4 & F5 & F6 & F7 & F8, F9>,
  f10: SignalStoreFeature<F1 & F2 & F3 & F4 & F5 & F6 & F7 & F8 & F9, F10>,
  f11: SignalStoreFeature<
    F1 & F2 & F3 & F4 & F5 & F6 & F7 & F8 & F9 & F10,
    F11
  >,
  f12: SignalStoreFeature<
    F1 & F2 & F3 & F4 & F5 & F6 & F7 & F8 & F9 & F10 & F11,
    F12
  >,
  f13: SignalStoreFeature<
    F1 & F2 & F3 & F4 & F5 & F6 & F7 & F8 & F9 & F10 & F11 & F12,
    F13
  >,
  f14: SignalStoreFeature<
    F1 & F2 & F3 & F4 & F5 & F6 & F7 & F8 & F9 & F10 & F11 & F12 & F13,
    F14
  >
): Type<SignalStoreMembers<R> & StateSource<Prettify<OmitPrivate<R['state']>>>>;
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
  R extends SignalStoreFeatureResult = F1 &
    F2 &
    F3 &
    F4 &
    F5 &
    F6 &
    F7 &
    F8 &
    F9 &
    F10 &
    F11 &
    F12 &
    F13 &
    F14 &
    F15
>(
  f1: SignalStoreFeature<EmptyFeatureResult, F1>,
  f2: SignalStoreFeature<{} & F1, F2>,
  f3: SignalStoreFeature<F1 & F2, F3>,
  f4: SignalStoreFeature<F1 & F2 & F3, F4>,
  f5: SignalStoreFeature<F1 & F2 & F3 & F4, F5>,
  f6: SignalStoreFeature<F1 & F2 & F3 & F4 & F5, F6>,
  f7: SignalStoreFeature<F1 & F2 & F3 & F4 & F5 & F6, F7>,
  f8: SignalStoreFeature<F1 & F2 & F3 & F4 & F5 & F6 & F7, F8>,
  f9: SignalStoreFeature<F1 & F2 & F3 & F4 & F5 & F6 & F7 & F8, F9>,
  f10: SignalStoreFeature<F1 & F2 & F3 & F4 & F5 & F6 & F7 & F8 & F9, F10>,
  f11: SignalStoreFeature<
    F1 & F2 & F3 & F4 & F5 & F6 & F7 & F8 & F9 & F10,
    F11
  >,
  f12: SignalStoreFeature<
    F1 & F2 & F3 & F4 & F5 & F6 & F7 & F8 & F9 & F10 & F11,
    F12
  >,
  f13: SignalStoreFeature<
    F1 & F2 & F3 & F4 & F5 & F6 & F7 & F8 & F9 & F10 & F11 & F12,
    F13
  >,
  f14: SignalStoreFeature<
    F1 & F2 & F3 & F4 & F5 & F6 & F7 & F8 & F9 & F10 & F11 & F12 & F13,
    F14
  >,
  f15: SignalStoreFeature<
    F1 & F2 & F3 & F4 & F5 & F6 & F7 & F8 & F9 & F10 & F11 & F12 & F13 & F14,
    F15
  >
): Type<SignalStoreMembers<R> & StateSource<Prettify<OmitPrivate<R['state']>>>>;

export function signalStore<F1 extends SignalStoreFeatureResult>(
  config: { providedIn?: 'root'; protectedState?: true },
  f1: SignalStoreFeature<EmptyFeatureResult, F1>
): Type<
  SignalStoreMembers<F1> & StateSource<Prettify<OmitPrivate<F1['state']>>>
>;
export function signalStore<
  F1 extends SignalStoreFeatureResult,
  F2 extends SignalStoreFeatureResult,
  R extends SignalStoreFeatureResult = F1 & F2
>(
  config: { providedIn?: 'root'; protectedState?: true },
  f1: SignalStoreFeature<EmptyFeatureResult, F1>,
  f2: SignalStoreFeature<{} & F1, F2>
): Type<SignalStoreMembers<R> & StateSource<Prettify<OmitPrivate<R['state']>>>>;
export function signalStore<
  F1 extends SignalStoreFeatureResult,
  F2 extends SignalStoreFeatureResult,
  F3 extends SignalStoreFeatureResult,
  R extends SignalStoreFeatureResult = F1 & F2 & F3
>(
  config: { providedIn?: 'root'; protectedState?: true },
  f1: SignalStoreFeature<EmptyFeatureResult, F1>,
  f2: SignalStoreFeature<{} & F1, F2>,
  f3: SignalStoreFeature<F1 & F2, F3>
): Type<SignalStoreMembers<R> & StateSource<Prettify<OmitPrivate<R['state']>>>>;
export function signalStore<
  F1 extends SignalStoreFeatureResult,
  F2 extends SignalStoreFeatureResult,
  F3 extends SignalStoreFeatureResult,
  F4 extends SignalStoreFeatureResult,
  R extends SignalStoreFeatureResult = F1 & F2 & F3 & F4
>(
  config: { providedIn?: 'root'; protectedState?: true },
  f1: SignalStoreFeature<EmptyFeatureResult, F1>,
  f2: SignalStoreFeature<{} & F1, F2>,
  f3: SignalStoreFeature<F1 & F2, F3>,
  f4: SignalStoreFeature<F1 & F2 & F3, F4>
): Type<SignalStoreMembers<R> & StateSource<Prettify<OmitPrivate<R['state']>>>>;
export function signalStore<
  F1 extends SignalStoreFeatureResult,
  F2 extends SignalStoreFeatureResult,
  F3 extends SignalStoreFeatureResult,
  F4 extends SignalStoreFeatureResult,
  F5 extends SignalStoreFeatureResult,
  R extends SignalStoreFeatureResult = F1 & F2 & F3 & F4 & F5
>(
  config: { providedIn?: 'root'; protectedState?: true },
  f1: SignalStoreFeature<EmptyFeatureResult, F1>,
  f2: SignalStoreFeature<{} & F1, F2>,
  f3: SignalStoreFeature<F1 & F2, F3>,
  f4: SignalStoreFeature<F1 & F2 & F3, F4>,
  f5: SignalStoreFeature<F1 & F2 & F3 & F4, F5>
): Type<SignalStoreMembers<R> & StateSource<Prettify<OmitPrivate<R['state']>>>>;
export function signalStore<
  F1 extends SignalStoreFeatureResult,
  F2 extends SignalStoreFeatureResult,
  F3 extends SignalStoreFeatureResult,
  F4 extends SignalStoreFeatureResult,
  F5 extends SignalStoreFeatureResult,
  F6 extends SignalStoreFeatureResult,
  R extends SignalStoreFeatureResult = F1 & F2 & F3 & F4 & F5 & F6
>(
  config: { providedIn?: 'root'; protectedState?: true },
  f1: SignalStoreFeature<EmptyFeatureResult, F1>,
  f2: SignalStoreFeature<{} & F1, F2>,
  f3: SignalStoreFeature<F1 & F2, F3>,
  f4: SignalStoreFeature<F1 & F2 & F3, F4>,
  f5: SignalStoreFeature<F1 & F2 & F3 & F4, F5>,
  f6: SignalStoreFeature<F1 & F2 & F3 & F4 & F5, F6>
): Type<SignalStoreMembers<R> & StateSource<Prettify<OmitPrivate<R['state']>>>>;
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
  config: { providedIn?: 'root'; protectedState?: true },
  f1: SignalStoreFeature<EmptyFeatureResult, F1>,
  f2: SignalStoreFeature<{} & F1, F2>,
  f3: SignalStoreFeature<F1 & F2, F3>,
  f4: SignalStoreFeature<F1 & F2 & F3, F4>,
  f5: SignalStoreFeature<F1 & F2 & F3 & F4, F5>,
  f6: SignalStoreFeature<F1 & F2 & F3 & F4 & F5, F6>,
  f7: SignalStoreFeature<F1 & F2 & F3 & F4 & F5 & F6, F7>
): Type<SignalStoreMembers<R> & StateSource<Prettify<OmitPrivate<R['state']>>>>;
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
  config: { providedIn?: 'root'; protectedState?: true },
  f1: SignalStoreFeature<EmptyFeatureResult, F1>,
  f2: SignalStoreFeature<{} & F1, F2>,
  f3: SignalStoreFeature<F1 & F2, F3>,
  f4: SignalStoreFeature<F1 & F2 & F3, F4>,
  f5: SignalStoreFeature<F1 & F2 & F3 & F4, F5>,
  f6: SignalStoreFeature<F1 & F2 & F3 & F4 & F5, F6>,
  f7: SignalStoreFeature<F1 & F2 & F3 & F4 & F5 & F6, F7>,
  f8: SignalStoreFeature<F1 & F2 & F3 & F4 & F5 & F6 & F7, F8>
): Type<SignalStoreMembers<R> & StateSource<Prettify<OmitPrivate<R['state']>>>>;
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
  config: { providedIn?: 'root'; protectedState?: true },
  f1: SignalStoreFeature<EmptyFeatureResult, F1>,
  f2: SignalStoreFeature<{} & F1, F2>,
  f3: SignalStoreFeature<F1 & F2, F3>,
  f4: SignalStoreFeature<F1 & F2 & F3, F4>,
  f5: SignalStoreFeature<F1 & F2 & F3 & F4, F5>,
  f6: SignalStoreFeature<F1 & F2 & F3 & F4 & F5, F6>,
  f7: SignalStoreFeature<F1 & F2 & F3 & F4 & F5 & F6, F7>,
  f8: SignalStoreFeature<F1 & F2 & F3 & F4 & F5 & F6 & F7, F8>,
  f9: SignalStoreFeature<F1 & F2 & F3 & F4 & F5 & F6 & F7 & F8, F9>
): Type<SignalStoreMembers<R> & StateSource<Prettify<OmitPrivate<R['state']>>>>;
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
  R extends SignalStoreFeatureResult = F1 &
    F2 &
    F3 &
    F4 &
    F5 &
    F6 &
    F7 &
    F8 &
    F9 &
    F10
>(
  config: { providedIn?: 'root'; protectedState?: true },
  f1: SignalStoreFeature<EmptyFeatureResult, F1>,
  f2: SignalStoreFeature<{} & F1, F2>,
  f3: SignalStoreFeature<F1 & F2, F3>,
  f4: SignalStoreFeature<F1 & F2 & F3, F4>,
  f5: SignalStoreFeature<F1 & F2 & F3 & F4, F5>,
  f6: SignalStoreFeature<F1 & F2 & F3 & F4 & F5, F6>,
  f7: SignalStoreFeature<F1 & F2 & F3 & F4 & F5 & F6, F7>,
  f8: SignalStoreFeature<F1 & F2 & F3 & F4 & F5 & F6 & F7, F8>,
  f9: SignalStoreFeature<F1 & F2 & F3 & F4 & F5 & F6 & F7 & F8, F9>,
  f10: SignalStoreFeature<F1 & F2 & F3 & F4 & F5 & F6 & F7 & F8 & F9, F10>
): Type<SignalStoreMembers<R> & StateSource<Prettify<OmitPrivate<R['state']>>>>;
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
  R extends SignalStoreFeatureResult = F1 &
    F2 &
    F3 &
    F4 &
    F5 &
    F6 &
    F7 &
    F8 &
    F9 &
    F10 &
    F11
>(
  config: { providedIn?: 'root'; protectedState?: true },
  f1: SignalStoreFeature<EmptyFeatureResult, F1>,
  f2: SignalStoreFeature<{} & F1, F2>,
  f3: SignalStoreFeature<F1 & F2, F3>,
  f4: SignalStoreFeature<F1 & F2 & F3, F4>,
  f5: SignalStoreFeature<F1 & F2 & F3 & F4, F5>,
  f6: SignalStoreFeature<F1 & F2 & F3 & F4 & F5, F6>,
  f7: SignalStoreFeature<F1 & F2 & F3 & F4 & F5 & F6, F7>,
  f8: SignalStoreFeature<F1 & F2 & F3 & F4 & F5 & F6 & F7, F8>,
  f9: SignalStoreFeature<F1 & F2 & F3 & F4 & F5 & F6 & F7 & F8, F9>,
  f10: SignalStoreFeature<F1 & F2 & F3 & F4 & F5 & F6 & F7 & F8 & F9, F10>,
  f11: SignalStoreFeature<F1 & F2 & F3 & F4 & F5 & F6 & F7 & F8 & F9 & F10, F11>
): Type<SignalStoreMembers<R> & StateSource<Prettify<OmitPrivate<R['state']>>>>;
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
  R extends SignalStoreFeatureResult = F1 &
    F2 &
    F3 &
    F4 &
    F5 &
    F6 &
    F7 &
    F8 &
    F9 &
    F10 &
    F11 &
    F12
>(
  config: { providedIn?: 'root'; protectedState?: true },
  f1: SignalStoreFeature<EmptyFeatureResult, F1>,
  f2: SignalStoreFeature<{} & F1, F2>,
  f3: SignalStoreFeature<F1 & F2, F3>,
  f4: SignalStoreFeature<F1 & F2 & F3, F4>,
  f5: SignalStoreFeature<F1 & F2 & F3 & F4, F5>,
  f6: SignalStoreFeature<F1 & F2 & F3 & F4 & F5, F6>,
  f7: SignalStoreFeature<F1 & F2 & F3 & F4 & F5 & F6, F7>,
  f8: SignalStoreFeature<F1 & F2 & F3 & F4 & F5 & F6 & F7, F8>,
  f9: SignalStoreFeature<F1 & F2 & F3 & F4 & F5 & F6 & F7 & F8, F9>,
  f10: SignalStoreFeature<F1 & F2 & F3 & F4 & F5 & F6 & F7 & F8 & F9, F10>,
  f11: SignalStoreFeature<
    F1 & F2 & F3 & F4 & F5 & F6 & F7 & F8 & F9 & F10,
    F11
  >,
  f12: SignalStoreFeature<
    F1 & F2 & F3 & F4 & F5 & F6 & F7 & F8 & F9 & F10 & F11,
    F12
  >
): Type<SignalStoreMembers<R> & StateSource<Prettify<OmitPrivate<R['state']>>>>;
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
  R extends SignalStoreFeatureResult = F1 &
    F2 &
    F3 &
    F4 &
    F5 &
    F6 &
    F7 &
    F8 &
    F9 &
    F10 &
    F11 &
    F12 &
    F13
>(
  config: { providedIn?: 'root'; protectedState?: true },
  f1: SignalStoreFeature<EmptyFeatureResult, F1>,
  f2: SignalStoreFeature<{} & F1, F2>,
  f3: SignalStoreFeature<F1 & F2, F3>,
  f4: SignalStoreFeature<F1 & F2 & F3, F4>,
  f5: SignalStoreFeature<F1 & F2 & F3 & F4, F5>,
  f6: SignalStoreFeature<F1 & F2 & F3 & F4 & F5, F6>,
  f7: SignalStoreFeature<F1 & F2 & F3 & F4 & F5 & F6, F7>,
  f8: SignalStoreFeature<F1 & F2 & F3 & F4 & F5 & F6 & F7, F8>,
  f9: SignalStoreFeature<F1 & F2 & F3 & F4 & F5 & F6 & F7 & F8, F9>,
  f10: SignalStoreFeature<F1 & F2 & F3 & F4 & F5 & F6 & F7 & F8 & F9, F10>,
  f11: SignalStoreFeature<
    F1 & F2 & F3 & F4 & F5 & F6 & F7 & F8 & F9 & F10,
    F11
  >,
  f12: SignalStoreFeature<
    F1 & F2 & F3 & F4 & F5 & F6 & F7 & F8 & F9 & F10 & F11,
    F12
  >,
  f13: SignalStoreFeature<
    F1 & F2 & F3 & F4 & F5 & F6 & F7 & F8 & F9 & F10 & F11 & F12,
    F13
  >
): Type<SignalStoreMembers<R> & StateSource<Prettify<OmitPrivate<R['state']>>>>;
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
  R extends SignalStoreFeatureResult = F1 &
    F2 &
    F3 &
    F4 &
    F5 &
    F6 &
    F7 &
    F8 &
    F9 &
    F10 &
    F11 &
    F12 &
    F13 &
    F14
>(
  config: { providedIn?: 'root'; protectedState?: true },
  f1: SignalStoreFeature<EmptyFeatureResult, F1>,
  f2: SignalStoreFeature<{} & F1, F2>,
  f3: SignalStoreFeature<F1 & F2, F3>,
  f4: SignalStoreFeature<F1 & F2 & F3, F4>,
  f5: SignalStoreFeature<F1 & F2 & F3 & F4, F5>,
  f6: SignalStoreFeature<F1 & F2 & F3 & F4 & F5, F6>,
  f7: SignalStoreFeature<F1 & F2 & F3 & F4 & F5 & F6, F7>,
  f8: SignalStoreFeature<F1 & F2 & F3 & F4 & F5 & F6 & F7, F8>,
  f9: SignalStoreFeature<F1 & F2 & F3 & F4 & F5 & F6 & F7 & F8, F9>,
  f10: SignalStoreFeature<F1 & F2 & F3 & F4 & F5 & F6 & F7 & F8 & F9, F10>,
  f11: SignalStoreFeature<
    F1 & F2 & F3 & F4 & F5 & F6 & F7 & F8 & F9 & F10,
    F11
  >,
  f12: SignalStoreFeature<
    F1 & F2 & F3 & F4 & F5 & F6 & F7 & F8 & F9 & F10 & F11,
    F12
  >,
  f13: SignalStoreFeature<
    F1 & F2 & F3 & F4 & F5 & F6 & F7 & F8 & F9 & F10 & F11 & F12,
    F13
  >,
  f14: SignalStoreFeature<
    F1 & F2 & F3 & F4 & F5 & F6 & F7 & F8 & F9 & F10 & F11 & F12 & F13,
    F14
  >
): Type<SignalStoreMembers<R> & StateSource<Prettify<OmitPrivate<R['state']>>>>;
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
  R extends SignalStoreFeatureResult = F1 &
    F2 &
    F3 &
    F4 &
    F5 &
    F6 &
    F7 &
    F8 &
    F9 &
    F10 &
    F11 &
    F12 &
    F13 &
    F14 &
    F15
>(
  config: { providedIn?: 'root'; protectedState?: true },
  f1: SignalStoreFeature<EmptyFeatureResult, F1>,
  f2: SignalStoreFeature<{} & F1, F2>,
  f3: SignalStoreFeature<F1 & F2, F3>,
  f4: SignalStoreFeature<F1 & F2 & F3, F4>,
  f5: SignalStoreFeature<F1 & F2 & F3 & F4, F5>,
  f6: SignalStoreFeature<F1 & F2 & F3 & F4 & F5, F6>,
  f7: SignalStoreFeature<F1 & F2 & F3 & F4 & F5 & F6, F7>,
  f8: SignalStoreFeature<F1 & F2 & F3 & F4 & F5 & F6 & F7, F8>,
  f9: SignalStoreFeature<F1 & F2 & F3 & F4 & F5 & F6 & F7 & F8, F9>,
  f10: SignalStoreFeature<F1 & F2 & F3 & F4 & F5 & F6 & F7 & F8 & F9, F10>,
  f11: SignalStoreFeature<
    F1 & F2 & F3 & F4 & F5 & F6 & F7 & F8 & F9 & F10,
    F11
  >,
  f12: SignalStoreFeature<
    F1 & F2 & F3 & F4 & F5 & F6 & F7 & F8 & F9 & F10 & F11,
    F12
  >,
  f13: SignalStoreFeature<
    F1 & F2 & F3 & F4 & F5 & F6 & F7 & F8 & F9 & F10 & F11 & F12,
    F13
  >,
  f14: SignalStoreFeature<
    F1 & F2 & F3 & F4 & F5 & F6 & F7 & F8 & F9 & F10 & F11 & F12 & F13,
    F14
  >,
  f15: SignalStoreFeature<
    F1 & F2 & F3 & F4 & F5 & F6 & F7 & F8 & F9 & F10 & F11 & F12 & F13 & F14,
    F15
  >
): Type<SignalStoreMembers<R> & StateSource<Prettify<OmitPrivate<R['state']>>>>;

export function signalStore<F1 extends SignalStoreFeatureResult>(
  config: { providedIn?: 'root'; protectedState: false },
  f1: SignalStoreFeature<EmptyFeatureResult, F1>
): Type<
  SignalStoreMembers<F1> &
    WritableStateSource<Prettify<OmitPrivate<F1['state']>>>
>;
export function signalStore<
  F1 extends SignalStoreFeatureResult,
  F2 extends SignalStoreFeatureResult,
  R extends SignalStoreFeatureResult = F1 & F2
>(
  config: { providedIn?: 'root'; protectedState: false },
  f1: SignalStoreFeature<EmptyFeatureResult, F1>,
  f2: SignalStoreFeature<{} & F1, F2>
): Type<
  SignalStoreMembers<R> & WritableStateSource<Prettify<OmitPrivate<R['state']>>>
>;
export function signalStore<
  F1 extends SignalStoreFeatureResult,
  F2 extends SignalStoreFeatureResult,
  F3 extends SignalStoreFeatureResult,
  R extends SignalStoreFeatureResult = F1 & F2 & F3
>(
  config: { providedIn?: 'root'; protectedState: false },
  f1: SignalStoreFeature<EmptyFeatureResult, F1>,
  f2: SignalStoreFeature<{} & F1, F2>,
  f3: SignalStoreFeature<F1 & F2, F3>
): Type<
  SignalStoreMembers<R> & WritableStateSource<Prettify<OmitPrivate<R['state']>>>
>;
export function signalStore<
  F1 extends SignalStoreFeatureResult,
  F2 extends SignalStoreFeatureResult,
  F3 extends SignalStoreFeatureResult,
  F4 extends SignalStoreFeatureResult,
  R extends SignalStoreFeatureResult = F1 & F2 & F3 & F4
>(
  config: { providedIn?: 'root'; protectedState: false },
  f1: SignalStoreFeature<EmptyFeatureResult, F1>,
  f2: SignalStoreFeature<{} & F1, F2>,
  f3: SignalStoreFeature<F1 & F2, F3>,
  f4: SignalStoreFeature<F1 & F2 & F3, F4>
): Type<
  SignalStoreMembers<R> & WritableStateSource<Prettify<OmitPrivate<R['state']>>>
>;
export function signalStore<
  F1 extends SignalStoreFeatureResult,
  F2 extends SignalStoreFeatureResult,
  F3 extends SignalStoreFeatureResult,
  F4 extends SignalStoreFeatureResult,
  F5 extends SignalStoreFeatureResult,
  R extends SignalStoreFeatureResult = F1 & F2 & F3 & F4 & F5
>(
  config: { providedIn?: 'root'; protectedState: false },
  f1: SignalStoreFeature<EmptyFeatureResult, F1>,
  f2: SignalStoreFeature<{} & F1, F2>,
  f3: SignalStoreFeature<F1 & F2, F3>,
  f4: SignalStoreFeature<F1 & F2 & F3, F4>,
  f5: SignalStoreFeature<F1 & F2 & F3 & F4, F5>
): Type<
  SignalStoreMembers<R> & WritableStateSource<Prettify<OmitPrivate<R['state']>>>
>;
export function signalStore<
  F1 extends SignalStoreFeatureResult,
  F2 extends SignalStoreFeatureResult,
  F3 extends SignalStoreFeatureResult,
  F4 extends SignalStoreFeatureResult,
  F5 extends SignalStoreFeatureResult,
  F6 extends SignalStoreFeatureResult,
  R extends SignalStoreFeatureResult = F1 & F2 & F3 & F4 & F5 & F6
>(
  config: { providedIn?: 'root'; protectedState: false },
  f1: SignalStoreFeature<EmptyFeatureResult, F1>,
  f2: SignalStoreFeature<{} & F1, F2>,
  f3: SignalStoreFeature<F1 & F2, F3>,
  f4: SignalStoreFeature<F1 & F2 & F3, F4>,
  f5: SignalStoreFeature<F1 & F2 & F3 & F4, F5>,
  f6: SignalStoreFeature<F1 & F2 & F3 & F4 & F5, F6>
): Type<
  SignalStoreMembers<R> & WritableStateSource<Prettify<OmitPrivate<R['state']>>>
>;
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
  config: { providedIn?: 'root'; protectedState: false },
  f1: SignalStoreFeature<EmptyFeatureResult, F1>,
  f2: SignalStoreFeature<{} & F1, F2>,
  f3: SignalStoreFeature<F1 & F2, F3>,
  f4: SignalStoreFeature<F1 & F2 & F3, F4>,
  f5: SignalStoreFeature<F1 & F2 & F3 & F4, F5>,
  f6: SignalStoreFeature<F1 & F2 & F3 & F4 & F5, F6>,
  f7: SignalStoreFeature<F1 & F2 & F3 & F4 & F5 & F6, F7>
): Type<
  SignalStoreMembers<R> & WritableStateSource<Prettify<OmitPrivate<R['state']>>>
>;
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
  config: { providedIn?: 'root'; protectedState: false },
  f1: SignalStoreFeature<EmptyFeatureResult, F1>,
  f2: SignalStoreFeature<{} & F1, F2>,
  f3: SignalStoreFeature<F1 & F2, F3>,
  f4: SignalStoreFeature<F1 & F2 & F3, F4>,
  f5: SignalStoreFeature<F1 & F2 & F3 & F4, F5>,
  f6: SignalStoreFeature<F1 & F2 & F3 & F4 & F5, F6>,
  f7: SignalStoreFeature<F1 & F2 & F3 & F4 & F5 & F6, F7>,
  f8: SignalStoreFeature<F1 & F2 & F3 & F4 & F5 & F6 & F7, F8>
): Type<
  SignalStoreMembers<R> & WritableStateSource<Prettify<OmitPrivate<R['state']>>>
>;
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
  config: { providedIn?: 'root'; protectedState: false },
  f1: SignalStoreFeature<EmptyFeatureResult, F1>,
  f2: SignalStoreFeature<{} & F1, F2>,
  f3: SignalStoreFeature<F1 & F2, F3>,
  f4: SignalStoreFeature<F1 & F2 & F3, F4>,
  f5: SignalStoreFeature<F1 & F2 & F3 & F4, F5>,
  f6: SignalStoreFeature<F1 & F2 & F3 & F4 & F5, F6>,
  f7: SignalStoreFeature<F1 & F2 & F3 & F4 & F5 & F6, F7>,
  f8: SignalStoreFeature<F1 & F2 & F3 & F4 & F5 & F6 & F7, F8>,
  f9: SignalStoreFeature<F1 & F2 & F3 & F4 & F5 & F6 & F7 & F8, F9>
): Type<
  SignalStoreMembers<R> & WritableStateSource<Prettify<OmitPrivate<R['state']>>>
>;
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
  R extends SignalStoreFeatureResult = F1 &
    F2 &
    F3 &
    F4 &
    F5 &
    F6 &
    F7 &
    F8 &
    F9 &
    F10
>(
  config: { providedIn?: 'root'; protectedState: false },
  f1: SignalStoreFeature<EmptyFeatureResult, F1>,
  f2: SignalStoreFeature<{} & F1, F2>,
  f3: SignalStoreFeature<F1 & F2, F3>,
  f4: SignalStoreFeature<F1 & F2 & F3, F4>,
  f5: SignalStoreFeature<F1 & F2 & F3 & F4, F5>,
  f6: SignalStoreFeature<F1 & F2 & F3 & F4 & F5, F6>,
  f7: SignalStoreFeature<F1 & F2 & F3 & F4 & F5 & F6, F7>,
  f8: SignalStoreFeature<F1 & F2 & F3 & F4 & F5 & F6 & F7, F8>,
  f9: SignalStoreFeature<F1 & F2 & F3 & F4 & F5 & F6 & F7 & F8, F9>,
  f10: SignalStoreFeature<F1 & F2 & F3 & F4 & F5 & F6 & F7 & F8 & F9, F10>
): Type<
  SignalStoreMembers<R> & WritableStateSource<Prettify<OmitPrivate<R['state']>>>
>;
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
  R extends SignalStoreFeatureResult = F1 &
    F2 &
    F3 &
    F4 &
    F5 &
    F6 &
    F7 &
    F8 &
    F9 &
    F10 &
    F11
>(
  config: { providedIn?: 'root'; protectedState: false },
  f1: SignalStoreFeature<EmptyFeatureResult, F1>,
  f2: SignalStoreFeature<{} & F1, F2>,
  f3: SignalStoreFeature<F1 & F2, F3>,
  f4: SignalStoreFeature<F1 & F2 & F3, F4>,
  f5: SignalStoreFeature<F1 & F2 & F3 & F4, F5>,
  f6: SignalStoreFeature<F1 & F2 & F3 & F4 & F5, F6>,
  f7: SignalStoreFeature<F1 & F2 & F3 & F4 & F5 & F6, F7>,
  f8: SignalStoreFeature<F1 & F2 & F3 & F4 & F5 & F6 & F7, F8>,
  f9: SignalStoreFeature<F1 & F2 & F3 & F4 & F5 & F6 & F7 & F8, F9>,
  f10: SignalStoreFeature<F1 & F2 & F3 & F4 & F5 & F6 & F7 & F8 & F9, F10>,
  f11: SignalStoreFeature<F1 & F2 & F3 & F4 & F5 & F6 & F7 & F8 & F9 & F10, F11>
): Type<
  SignalStoreMembers<R> & WritableStateSource<Prettify<OmitPrivate<R['state']>>>
>;
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
  R extends SignalStoreFeatureResult = F1 &
    F2 &
    F3 &
    F4 &
    F5 &
    F6 &
    F7 &
    F8 &
    F9 &
    F10 &
    F11 &
    F12
>(
  config: { providedIn?: 'root'; protectedState: false },
  f1: SignalStoreFeature<EmptyFeatureResult, F1>,
  f2: SignalStoreFeature<{} & F1, F2>,
  f3: SignalStoreFeature<F1 & F2, F3>,
  f4: SignalStoreFeature<F1 & F2 & F3, F4>,
  f5: SignalStoreFeature<F1 & F2 & F3 & F4, F5>,
  f6: SignalStoreFeature<F1 & F2 & F3 & F4 & F5, F6>,
  f7: SignalStoreFeature<F1 & F2 & F3 & F4 & F5 & F6, F7>,
  f8: SignalStoreFeature<F1 & F2 & F3 & F4 & F5 & F6 & F7, F8>,
  f9: SignalStoreFeature<F1 & F2 & F3 & F4 & F5 & F6 & F7 & F8, F9>,
  f10: SignalStoreFeature<F1 & F2 & F3 & F4 & F5 & F6 & F7 & F8 & F9, F10>,
  f11: SignalStoreFeature<
    F1 & F2 & F3 & F4 & F5 & F6 & F7 & F8 & F9 & F10,
    F11
  >,
  f12: SignalStoreFeature<
    F1 & F2 & F3 & F4 & F5 & F6 & F7 & F8 & F9 & F10 & F11,
    F12
  >
): Type<
  SignalStoreMembers<R> & WritableStateSource<Prettify<OmitPrivate<R['state']>>>
>;
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
  R extends SignalStoreFeatureResult = F1 &
    F2 &
    F3 &
    F4 &
    F5 &
    F6 &
    F7 &
    F8 &
    F9 &
    F10 &
    F11 &
    F12 &
    F13
>(
  config: { providedIn?: 'root'; protectedState: false },
  f1: SignalStoreFeature<EmptyFeatureResult, F1>,
  f2: SignalStoreFeature<{} & F1, F2>,
  f3: SignalStoreFeature<F1 & F2, F3>,
  f4: SignalStoreFeature<F1 & F2 & F3, F4>,
  f5: SignalStoreFeature<F1 & F2 & F3 & F4, F5>,
  f6: SignalStoreFeature<F1 & F2 & F3 & F4 & F5, F6>,
  f7: SignalStoreFeature<F1 & F2 & F3 & F4 & F5 & F6, F7>,
  f8: SignalStoreFeature<F1 & F2 & F3 & F4 & F5 & F6 & F7, F8>,
  f9: SignalStoreFeature<F1 & F2 & F3 & F4 & F5 & F6 & F7 & F8, F9>,
  f10: SignalStoreFeature<F1 & F2 & F3 & F4 & F5 & F6 & F7 & F8 & F9, F10>,
  f11: SignalStoreFeature<
    F1 & F2 & F3 & F4 & F5 & F6 & F7 & F8 & F9 & F10,
    F11
  >,
  f12: SignalStoreFeature<
    F1 & F2 & F3 & F4 & F5 & F6 & F7 & F8 & F9 & F10 & F11,
    F12
  >,
  f13: SignalStoreFeature<
    F1 & F2 & F3 & F4 & F5 & F6 & F7 & F8 & F9 & F10 & F11 & F12,
    F13
  >
): Type<
  SignalStoreMembers<R> & WritableStateSource<Prettify<OmitPrivate<R['state']>>>
>;
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
  R extends SignalStoreFeatureResult = F1 &
    F2 &
    F3 &
    F4 &
    F5 &
    F6 &
    F7 &
    F8 &
    F9 &
    F10 &
    F11 &
    F12 &
    F13 &
    F14
>(
  config: { providedIn?: 'root'; protectedState: false },
  f1: SignalStoreFeature<EmptyFeatureResult, F1>,
  f2: SignalStoreFeature<{} & F1, F2>,
  f3: SignalStoreFeature<F1 & F2, F3>,
  f4: SignalStoreFeature<F1 & F2 & F3, F4>,
  f5: SignalStoreFeature<F1 & F2 & F3 & F4, F5>,
  f6: SignalStoreFeature<F1 & F2 & F3 & F4 & F5, F6>,
  f7: SignalStoreFeature<F1 & F2 & F3 & F4 & F5 & F6, F7>,
  f8: SignalStoreFeature<F1 & F2 & F3 & F4 & F5 & F6 & F7, F8>,
  f9: SignalStoreFeature<F1 & F2 & F3 & F4 & F5 & F6 & F7 & F8, F9>,
  f10: SignalStoreFeature<F1 & F2 & F3 & F4 & F5 & F6 & F7 & F8 & F9, F10>,
  f11: SignalStoreFeature<
    F1 & F2 & F3 & F4 & F5 & F6 & F7 & F8 & F9 & F10,
    F11
  >,
  f12: SignalStoreFeature<
    F1 & F2 & F3 & F4 & F5 & F6 & F7 & F8 & F9 & F10 & F11,
    F12
  >,
  f13: SignalStoreFeature<
    F1 & F2 & F3 & F4 & F5 & F6 & F7 & F8 & F9 & F10 & F11 & F12,
    F13
  >,
  f14: SignalStoreFeature<
    F1 & F2 & F3 & F4 & F5 & F6 & F7 & F8 & F9 & F10 & F11 & F12 & F13,
    F14
  >
): Type<
  SignalStoreMembers<R> & WritableStateSource<Prettify<OmitPrivate<R['state']>>>
>;
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
  R extends SignalStoreFeatureResult = F1 &
    F2 &
    F3 &
    F4 &
    F5 &
    F6 &
    F7 &
    F8 &
    F9 &
    F10 &
    F11 &
    F12 &
    F13 &
    F14 &
    F15
>(
  config: { providedIn?: 'root'; protectedState: false },
  f1: SignalStoreFeature<EmptyFeatureResult, F1>,
  f2: SignalStoreFeature<{} & F1, F2>,
  f3: SignalStoreFeature<F1 & F2, F3>,
  f4: SignalStoreFeature<F1 & F2 & F3, F4>,
  f5: SignalStoreFeature<F1 & F2 & F3 & F4, F5>,
  f6: SignalStoreFeature<F1 & F2 & F3 & F4 & F5, F6>,
  f7: SignalStoreFeature<F1 & F2 & F3 & F4 & F5 & F6, F7>,
  f8: SignalStoreFeature<F1 & F2 & F3 & F4 & F5 & F6 & F7, F8>,
  f9: SignalStoreFeature<F1 & F2 & F3 & F4 & F5 & F6 & F7 & F8, F9>,
  f10: SignalStoreFeature<F1 & F2 & F3 & F4 & F5 & F6 & F7 & F8 & F9, F10>,
  f11: SignalStoreFeature<
    F1 & F2 & F3 & F4 & F5 & F6 & F7 & F8 & F9 & F10,
    F11
  >,
  f12: SignalStoreFeature<
    F1 & F2 & F3 & F4 & F5 & F6 & F7 & F8 & F9 & F10 & F11,
    F12
  >,
  f13: SignalStoreFeature<
    F1 & F2 & F3 & F4 & F5 & F6 & F7 & F8 & F9 & F10 & F11 & F12,
    F13
  >,
  f14: SignalStoreFeature<
    F1 & F2 & F3 & F4 & F5 & F6 & F7 & F8 & F9 & F10 & F11 & F12 & F13,
    F14
  >,
  f15: SignalStoreFeature<
    F1 & F2 & F3 & F4 & F5 & F6 & F7 & F8 & F9 & F10 & F11 & F12 & F13 & F14,
    F15
  >
): Type<
  SignalStoreMembers<R> & WritableStateSource<Prettify<OmitPrivate<R['state']>>>
>;

export function signalStore(
  ...args: [SignalStoreConfig, ...SignalStoreFeature[]] | SignalStoreFeature[]
): Type<SignalStoreMembers<any>> {
  const signalStoreArgs = [...args];

  const config =
    typeof signalStoreArgs[0] === 'function'
      ? {}
      : (signalStoreArgs.shift() as SignalStoreConfig);
  const features = signalStoreArgs as SignalStoreFeature[];

  @Injectable({ providedIn: config.providedIn || null })
  class SignalStore {
    constructor() {
      const innerStore = features.reduce(
        (store, feature) => feature(store),
        getInitialInnerStore()
      );
      const { stateSignals, props, methods, hooks } = innerStore;
      const storeMembers: Record<string | symbol, unknown> = {
        ...stateSignals,
        ...props,
        ...methods,
      };

      (this as any)[STATE_SOURCE] = innerStore[STATE_SOURCE];

      for (const key of Reflect.ownKeys(storeMembers)) {
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
    [STATE_SOURCE]: {},
    stateSignals: {},
    props: {},
    methods: {},
    hooks: {},
  };
}
