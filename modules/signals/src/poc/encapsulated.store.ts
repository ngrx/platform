/**
 * This is a prototype of a `signalStore` version which supports encapsulation
 * via configuration.
 *
 * Encapsulation only applies to the generated store, not for the features inside
 * the store.
 *
 * The extended configuration gets the following properties:
 * - private: Array<keyof Store>: Encapsulates one or multiple property from the store.
 * - readonly: Set the state for `patchState` to `{}`. Therefore completely disabled the
 * possibility to update the state from the outside.
 * - readonlyExcept: Selectively mark properties "unpatchable" for `patchState`.
 *
 * Example with Store exposing
 *
 * It should be possible
 *
 * Following changes are necessary:
 * 1. `SignalStoreConfig` needs to be extended
 * 2. The return type of `signalStore` needs to use the new types `EncapsulatedStore`
 * and `EncapsulatedState`.
 * 3. This version contains only the types. The actual implementation - which should be
 * easier - still has to be done.
 */

import {
  EmptyFeatureResult,
  MergeFeatureResults,
  SignalStoreFeatureResult,
} from '../signal-store-models';

import {
  patchState,
  SignalStoreFeature,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { computed, Type } from '@angular/core';
import {
  EncapsulatedState,
  EncapsulatedStore,
  EncapsulationConfig,
} from './encapsulated.model';
import { signalStore as originalSignalStore } from '../signal-store';

export function signalStore<
  F1 extends SignalStoreFeatureResult,
  F2 extends SignalStoreFeatureResult,
  F3 extends SignalStoreFeatureResult,
  Config extends EncapsulationConfig<R>,
  R extends SignalStoreFeatureResult = MergeFeatureResults<[F1, F2, F3]>
>(
  config: Config,
  f1: SignalStoreFeature<EmptyFeatureResult, F1>,
  f2: SignalStoreFeature<{} & F1, F2>,
  f3: SignalStoreFeature<MergeFeatureResults<[F1, F2]>, F3>
): Type<EncapsulatedStore<R, Config> & EncapsulatedState<R, Config>> {
  return originalSignalStore(f1, f2, f3) as Type<
    EncapsulatedStore<R, Config> & EncapsulatedState<R, Config>
  >;
}
