import {
  patchState,
  SignalStoreFeature,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { computed, Type } from '@angular/core';
import {
  ExposableProperty,
  ExposedStateSignal,
  ExposedStore,
} from './exposed.models';
import {
  EmptyFeatureResult,
  MergeFeatureResults,
  SignalStoreConfig,
  SignalStoreFeatureResult,
} from '../signal-store-models';
import { StateSignal } from '../state-signal';
import { Prettify } from '../ts-helpers';

/**
 * `withEncapsulation` has its limitations. We cannot forbid `patchState` to update
 * the store and users have to use it always.
 *
 * It is good that it stands on top and does not depend on any position in the state.
 * By that, we can add further features but only those properties which are defined
 * at the top are exposed.
 *
 * If no state property is exposed, `patchUpdate` cannot be applied to the state.
 */

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

export declare function signalStore<
  F1 extends SignalStoreFeatureResult,
  F2 extends SignalStoreFeatureResult,
  F3 extends SignalStoreFeatureResult,
  R extends SignalStoreFeatureResult = MergeFeatureResults<[F1, F2, F3]>,
  Exposed extends Array<ExposableProperty<R>> = ['all']
>(
  config: { expose: Exposed } & SignalStoreConfig,
  f1: SignalStoreFeature<EmptyFeatureResult, F1>,
  f2: SignalStoreFeature<{} & F1, F2>,
  f3: SignalStoreFeature<MergeFeatureResults<[F1, F2]>, F3>
): Type<ExposedStore<R, Exposed> & ExposedStateSignal<R, Exposed>>;

const Store = signalStore(
  { providedIn: 'root', expose: ['prettyName', 'load', 'id'] },
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

const id = store.id; // exposed
const age = store.age; // not exposed
const birthday = store.birthday; // not exposed

patchState(store, { id: 2 }); // exposed
patchState(store, { firstname: 'Franz' }); // not exposed
patchState(store, (value) => {
  value.id = 2;
  return value;
}); // exposed update fn
patchState(store, (value) => {
  value.firstname = 'John';
  return value;
}); // not exposed update fn
