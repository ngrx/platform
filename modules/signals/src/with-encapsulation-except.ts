import { SignalStoreFeature, withState } from '@ngrx/signals';
import {
  EmptyFeatureResult,
  MergeFeatureResults,
  SignalStoreConfig,
  SignalStoreFeatureResult,
  SignalStoreProps,
} from './signal-store-models';
import { Type } from '@angular/core';
import { StateSignal } from './state-signal';
import { Prettify } from './ts-helpers';

/**
 * `withEncapsulation` has its limitations. We cannot forbit `patchState` to update
 * the store and users have to use it always.
 */

export function withExposed<Feature1 extends SignalStoreFeatureResult>() {}

declare function signalStore<
  F1 extends SignalStoreFeatureResult,
  F2 extends SignalStoreFeatureResult,
  R extends SignalStoreFeatureResult = MergeFeatureResults<[F1, F2]>
>(
  config: { expose: keyof R } & SignalStoreConfig,
  f1: SignalStoreFeature<EmptyFeatureResult, F1>,
  f2: SignalStoreFeature<{} & F1, F2>
): Type<SignalStoreProps<R> & StateSignal<Prettify<R['state']>>>;

declare function signalStore<
  F1 extends SignalStoreFeatureResult,
  F2 extends SignalStoreFeatureResult,
  F3 extends SignalStoreFeatureResult,
  R extends SignalStoreFeatureResult = MergeFeatureResults<[F1, F2, F3]>
>(
  config: { expose: keyof R } & SignalStoreConfig,
  f1: SignalStoreFeature<EmptyFeatureResult, F1>,
  f2: SignalStoreFeature<{} & F1, F2>,
  f3: SignalStoreFeature<MergeFeatureResults<[F1, F2]>, F3>
): Type<SignalStoreProps<R> & StateSignal<Prettify<R['state']>>>;

const Store = signalStore({ providedIn: 'root' }, withState());
