import {
  SignalStoreFeature,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { computed, Signal, Type } from '@angular/core';
import {
  ExposableProperty,
  ExposedState,
  ExposedStore,
} from './exposed.models';
import {
  EmptyFeatureResult,
  MergeFeatureResults,
  SignalStoreConfig,
  SignalStoreFeatureResult,
  SignalStoreProps,
  SignalStoreSlices,
} from '../signal-store-models';
import { StateSignal } from '../state-signal';
import { Prettify } from '../ts-helpers';
import { signalStore as originalSignalStore } from '../signal-store';

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

type ArrayToUnion<Store, Arrays extends Array<keyof Store>> = Arrays extends [
  infer First extends keyof Store,
  infer Second extends keyof Store
]
  ? First | Second
  : Arrays extends [
      infer First extends keyof Store,
      ...infer Rest extends Array<keyof Store>
    ]
  ? First | ArrayToUnion<Store, Rest>
  : Arrays extends [infer First extends keyof Store]
  ? First
  : never;

export declare function signalStore<
  F1 extends SignalStoreFeatureResult,
  F2 extends SignalStoreFeatureResult,
  F3 extends SignalStoreFeatureResult,
  R extends SignalStoreFeatureResult = MergeFeatureResults<[F1, F2, F3]>,
  Exposed extends Array<ExposableProperty<R>> = ['all'],
  ExposedKeys extends
    | keyof R['signals']
    | keyof R['methods']
    | keyof SignalStoreSlices<R['state']> = ArrayToUnion<
    SignalStoreProps<R>,
    Exposed
  >
>(
  config: { expose: Exposed } & SignalStoreConfig,
  f1: SignalStoreFeature<EmptyFeatureResult, F1>,
  f2: SignalStoreFeature<{} & F1, F2>,
  f3: SignalStoreFeature<MergeFeatureResults<[F1, F2]>, F3>
): Type<Pick<SignalStoreProps<R>, ExposedKeys>>;

const Store = signalStore(
  { providedIn: 'root', expose: ['prettyName', 'load'] },
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
store.load(1);

const OriginalStore = originalSignalStore(
  { providedIn: 'root' },
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

const originalStore = new OriginalStore();
const oId = originalStore.id;

type Arrays = ['prettyName', 'load'];

type Result = ArrayToUnion<typeof originalStore, Arrays>;

type Exposed = Pick<typeof originalStore, Result>;

function a(b: Exposed) {
  const p = b.prettyName;
}
