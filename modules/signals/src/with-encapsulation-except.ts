import {
  SignalStoreFeature,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import {
  EmptyFeatureResult,
  MergeFeatureResults,
  SignalStoreConfig,
  SignalStoreFeatureResult,
} from './signal-store-models';
import { computed, Signal, Type } from '@angular/core';
import { StateSignal } from './state-signal';
import { Prettify } from './ts-helpers';

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

type StoreProperty<
  Name extends keyof Store['methods'] | keyof Store['signals'],
  Store extends { methods: unknown; state: unknown; signals: unknown }
> = Name extends keyof Store['methods']
  ? Store['methods'][Name]
  : Name extends keyof Store['signals']
  ? Store['signals'][Name]
  : never;

type Exposables<R extends SignalStoreFeatureResult> =
  | keyof R['signals']
  | keyof R['methods']
  | keyof R['state']
  | 'all';

type ExposedStorePropertyName<
  PropertyName,
  Store extends SignalStoreFeatureResult
> = PropertyName extends keyof Store['signals']
  ? PropertyName
  : PropertyName extends keyof Store['methods']
  ? PropertyName
  : PropertyName extends keyof Store['state']
  ? PropertyName
  : never;

type ExposedStore<
  Store extends SignalStoreFeatureResult,
  PropertyNames extends Array<Exposables<Store>>
> = {
  [PropertyName in PropertyNames[number] as ExposedStorePropertyName<
    PropertyName,
    Store
  >]: StoreProperty<PropertyName, Store>;
};

type ExposedState<
  Store extends SignalStoreFeatureResult,
  PropertyNames extends Array<Exposables<Store>>
> = {
  [PropertyName in PropertyNames[number] as PropertyName extends keyof Store['state']
    ? PropertyName
    : never]: PropertyName extends keyof Store['state']
    ? Store['state'][PropertyName]
    : never;
};

type Store = {
  state: {
    id: number;
    firstname: string;
    surname: string;
    birthday: string;
  };
  methods: {
    load(id: number): void;
  };
  signals: {
    prettyName: Signal<string>;
    age: Signal<number>;
  };
};

function foobar(a: ExposedStore<Store, ['prettyName']>, b: Store) {}

declare function signalStore<
  F1 extends SignalStoreFeatureResult,
  F2 extends SignalStoreFeatureResult,
  F3 extends SignalStoreFeatureResult,
  R extends SignalStoreFeatureResult = MergeFeatureResults<[F1, F2, F3]>,
  Exposed extends Array<Exposables<R>> = ['all']
>(
  config: { expose: Exposed } & SignalStoreConfig,
  f1: SignalStoreFeature<EmptyFeatureResult, F1>,
  f2: SignalStoreFeature<{} & F1, F2>,
  f3: SignalStoreFeature<MergeFeatureResults<[F1, F2]>, F3>
): Type<
  ExposedStore<R, Exposed> & StateSignal<Prettify<ExposedState<R, Exposed>>>
>;

type AreEqual<A, B> = A extends B ? (B extends A ? true : false) : false;
type Assert<Condition extends true> = Condition;
type BiExclude<T, U> = Exclude<T, U> | Exclude<U, T>;

describe('Encapsulation Types', () => {
  test('Basics', () => {
    type _T0 = Assert<AreEqual<true, true>>;
  });
  test('Exposable type', () => {
    type _T1 = Assert<
      BiExclude<
        | 'prettyName'
        | 'age'
        | 'load'
        | 'id'
        | 'firstname'
        | 'surname'
        | 'birthday'
        | 'all',
        Exposables<Store>
      > extends never
        ? true
        : false
    >;
  });

  describe('ExposedStore', () => {
    test('exposed method', () => {
      type _T = Assert<
        AreEqual<{ load: (id: number) => void }, ExposedStore<Store, ['load']>>
      >;
    });
    test('exposed method and computed', () => {
      type _T = Assert<
        AreEqual<
          { load: (id: number) => void; age: Signal<number> },
          ExposedStore<Store, ['load', 'age']>
        >
      >;
    });
    test('exposed with state', () => {
      type _T = Assert<
        AreEqual<{ age: Signal<number> }, ExposedStore<Store, ['id', 'age']>>
      >;
    });
    test('exposed with only state properties', () => {
      type _T = Assert<AreEqual<{}, ExposedStore<Store, ['id', 'surname']>>>;
    });

    test('state properties should not be of type never', () => {
      type _T1 = Assert<
        // @ts-expect-error id does not exist
        AreEqual<
          { age: Signal<number>; id: never },
          ExposedStore<Store, ['id', 'age']>
        >
      >;

      type _T2 = Assert<
        // @ts-expect-error id does not exist
        AreEqual<
          { age: Signal<number>; id: undefined },
          ExposedStore<Store, ['id', 'age']>
        >
      >;
    });
  });

  describe('ExposedState', () => {
    test('exposed state', () => {
      type _T6 = Assert<
        AreEqual<
          { id: number; surname: string },
          ExposedState<Store, ['id', 'surname']>
        >
      >;
    });
  });

  describe('exposed property in state', () => {
    const setup = (
      expose: Array<
        | 'id'
        | 'firstname'
        | 'surname'
        | 'birthday'
        | 'prettyName'
        | 'age'
        | 'all'
      >
    ) =>
      signalStore(
        { providedIn: 'root', expose },
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

    it('should expose everything', () => {
      const Store = setup(['prettyName']);
      type Type<T extends { prettyName: Signal<string> }> = T;
      const store = new Store();
      const a: Type<typeof store> = store;
    });
  });
});

export function withExposed<Feature1 extends SignalStoreFeatureResult>() {}

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
type T = typeof store.load;
