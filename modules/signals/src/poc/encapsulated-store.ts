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
  patchState,
  SignalStoreFeature,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { computed, Type } from '@angular/core';
import { StateSignal } from '../state-signal';
import { Prettify } from '../ts-helpers';
import { ExposedStateSignal } from './exposed.models';

/**
 * union type of all property names of the resulting store.
 * 'all' is a shortcut to expose everything.
 */

type EncapsulationConfig<Features extends SignalStoreFeatureResult> = {
  private?: Array<keyof SignalStoreProps<Features>>;
} & (
  | { readonly?: boolean; readonlyExpect?: never }
  | {
      readonly?: never;
      readonlyExpect?: Array<keyof SignalStoreProps<Features>>;
    }
);

export type EncapsulatedStore<
  StoreFeatures extends SignalStoreFeatureResult,
  Config extends EncapsulationConfig<StoreFeatures>
> = Config['private'] extends Array<keyof SignalStoreProps<StoreFeatures>>
  ? Omit<
      SignalStoreProps<StoreFeatures>,
      keyof {
        [PropName in Config['private'][number]]: true;
      }
    >
  : SignalStoreProps<StoreFeatures>;

export type EncapsulatedState<
  StoreFeatures extends SignalStoreFeatureResult,
  Config extends EncapsulationConfig<StoreFeatures>
> = Config['readonly'] extends boolean
  ? StateSignal<{}>
  : Config['readonlyExpect'] extends Array<keyof StoreFeatures['state']>
  ? StateSignal<
      Prettify<
        Pick<
          StoreFeatures['state'],
          keyof {
            [PropName in Config['readonlyExpect'][number]]: true;
          }
        >
      >
    >
  : StateSignal<Prettify<StoreFeatures['state']>>;

export declare function signalStore<
  F1 extends SignalStoreFeatureResult,
  F2 extends SignalStoreFeatureResult,
  F3 extends SignalStoreFeatureResult,
  R extends SignalStoreFeatureResult = MergeFeatureResults<[F1, F2, F3]>,
  Config extends EncapsulationConfig<R> = {}
>(
  config: SignalStoreConfig & Config,
  f1: SignalStoreFeature<EmptyFeatureResult, F1>,
  f2: SignalStoreFeature<{} & F1, F2>,
  f3: SignalStoreFeature<MergeFeatureResults<[F1, F2]>, F3>
): Type<EncapsulatedStore<R, Config> & EncapsulatedState<R, Config>>;

const Store = signalStore(
  {
    providedIn: 'root',
    private: ['id', 'firstname', 'surname', 'birthday'],
    readonlyExpect: ['surname'],
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

const store = new Store();
const load = store.load;

patchState(store, (value) => {
  return { ...value, id: 2 };
});

patchState(store, { firstname: 'hallo' });
