/**
 * This is a prototype of a `signalStore` version which supports encapsulation.
 *
 * `expose` defines those properties which are accessible from the outside.
 * By default, everything is encapsulated. That also applies to `patchState`.
 *
 * Example with Store exposing
 *
 * It should be possible
 *
 * Following changes are necessary:
 * 1. `SignalStoreConfig`  gets an optional property `encapsulation` which
 * is expects an array of string values representing keys of the store's final
 * properties.
 * 2. The return type of `signalStore` needs to use the new types `ExposedStore`
 * and `ExposedStateSignal`.
 */

import {
  EmptyFeatureResult,
  MergeFeatureResults,
  SignalStoreConfig,
  SignalStoreFeatureResult,
  SignalStoreProps,
} from '../signal-store-models';

import {
  SignalStoreFeature,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { computed, Type } from '@angular/core';
import { StateSignal } from '../state-signal';

/**
 * union type of all property names of the resulting store.
 * 'all' is a shortcut to expose everything.
 */
export type ExposableProperty<Features extends SignalStoreFeatureResult> =
  // | keyof Features['signals']
  // | keyof Features['methods']
  keyof Features['state'];

type ExposableState<Features extends SignalStoreFeatureResult> =
  keyof Features['state'];

export type EncapsulatedConfig<Features extends SignalStoreFeatureResult> = {
  encapsulateState?: boolean;
  encapsulatePropsExcept?: Array<ExposableProperty<Features>>;
  encapsulateStateExcept?: Array<ExposableState<Features>>;
};

export declare function signalStore<
  F1 extends SignalStoreFeatureResult,
  F2 extends SignalStoreFeatureResult,
  F3 extends SignalStoreFeatureResult,
  R extends SignalStoreFeatureResult = MergeFeatureResults<[F1, F2, F3]>
>(
  config: SignalStoreConfig & EncapsulatedConfig<R>,
  f1: SignalStoreFeature<EmptyFeatureResult, F1>,
  f2: SignalStoreFeature<{} & F1, F2>,
  f3: SignalStoreFeature<MergeFeatureResults<[F1, F2]>, F3>
): Type<SignalStoreProps<R> & StateSignal<R>>;

const Store = signalStore(
  {
    providedIn: 'root',
    encapsulatePropsExcept: ['load'],
  },
  withState({
    id: 1,
    firstname: 'John',
    surname: 'List',
    birthday: new Date(1987, 5, 12),
  }),
  withMethods(() => {
    return { load: (id: number) => void true };
  }),
  withComputed((state) => {
    return {
      prettyName: computed(() => `${state.firstname} ${state.surname}`),
      age: computed(
        () =>
          (new Date().getTime() - state.birthday().getTime()) /
          (1_000 * 60 * 60 * 24 * 365)
      ),
    };
  })
);
