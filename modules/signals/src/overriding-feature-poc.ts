import { computed, Signal, Type } from '@angular/core';
import {
  EmptyFeatureResult,
  MergeFeatureResults,
  SignalStoreConfig,
  SignalStoreFeature,
  SignalStoreFeatureResult,
  SignalStoreProps,
} from './signal-store-models';
import { StateSignal } from './state-signal';
import { withState } from './with-state';
import { withComputed } from './with-computed';
import { withMethods } from '@ngrx/signals';
import { Prettify } from './ts-helpers';

/**
 * This Proof of Concept would introduce a feature which prevents
 * that feature override properties (`state`, `signals`, `methods`).
 *
 * It does that by adding a conditional type `NoOverride` which
 * as a constraint to the parameters of `signalState`.
 *
 * Example:
 * signalState(
 *   withState({ id: 1, name: 'hallo', prettyName: 'hi' }),
 *   withComputed((store) => {
 *     return {
 *       prettyName: computed(() => store.name()),
 *     };
 *   })
 * )
 *
 * This would fail to compile because `prettyName` is overriden.
 *
 * The overriding protection is enabled by default. It is very likely
 * that overriding doesn't happen on purpose.
 *
 * An opt-out is also possible via `signalState({allowOverrides: true})`.
 */

type OverridenProperties<T extends string> = `overriding property: '${T}'`;

export type NestedProperties<Type> = {
  [Property in keyof Type]: keyof Type[Property];
} extends Record<string, infer P>
  ? `${string & P}`
  : never;

export type SameProperties<Store, Extension> = Extract<
  NestedProperties<Store>,
  NestedProperties<Extension>
>;

export type NoOverride<
  Store extends SignalStoreFeatureResult,
  Feature extends SignalStoreFeatureResult
> = SameProperties<Store, Feature> extends never
  ? Extract<Store, Feature> extends never
    ? never
    : SameProperties<Store, Feature>
  : SameProperties<Store, Feature>;

type Merge<Features extends SignalStoreFeatureResult[]> = Features extends [
  infer Feature1 extends SignalStoreFeatureResult,
  infer Feature2 extends SignalStoreFeatureResult
]
  ? NoOverride<Feature1, Feature2> extends never
    ? SignalStoreFeature<Feature1, Feature2>
    : SignalStoreFeature<
        Feature1,
        EmptyFeatureResult & {
          state: {
            override: () => OverridenProperties<NoOverride<Feature1, Feature2>>;
          };
        }
      >
  : Features extends [
      infer Feature1 extends SignalStoreFeatureResult,
      infer Feature2 extends SignalStoreFeatureResult,
      ...infer RestFeatures extends SignalStoreFeatureResult[]
    ]
  ? NoOverride<Feature1, Feature2> extends never
    ? Merge<[MergeFeatureResults<[Feature1, Feature2]>, ...RestFeatures]>
    : never
  : never;

declare function signalStore<
  F1 extends SignalStoreFeatureResult,
  F2 extends SignalStoreFeatureResult,
  R extends SignalStoreFeatureResult = MergeFeatureResults<[F1, F2]>
>(
  f1: SignalStoreFeature<EmptyFeatureResult, F1>,
  f2: Merge<[{} & F1, F2]>
): Type<SignalStoreProps<R> & StateSignal<R['state']>>;

declare function signalStore<
  F1 extends SignalStoreFeatureResult,
  F2 extends SignalStoreFeatureResult,
  F3 extends SignalStoreFeatureResult,
  R extends SignalStoreFeatureResult = MergeFeatureResults<[F1, F2, F3]>
>(
  f1: SignalStoreFeature<EmptyFeatureResult, F1>,
  f2: Merge<[{} & F1, F2]>,
  f3: Merge<[F1, F2, F3]>
): Type<SignalStoreProps<R> & StateSignal<R['state']>>;

declare function signalStore<
  F1 extends SignalStoreFeatureResult,
  F2 extends SignalStoreFeatureResult,
  F3 extends SignalStoreFeatureResult,
  R extends SignalStoreFeatureResult = MergeFeatureResults<[F1, F2, F3]>
>(
  config: { allowOverrides: true } & SignalStoreConfig,
  f1: SignalStoreFeature<EmptyFeatureResult, F1>,
  f2: SignalStoreFeature<{} & F1, F2>,
  f3: SignalStoreFeature<MergeFeatureResults<[F1, F2]>, F3>
): Type<SignalStoreProps<R> & StateSignal<Prettify<R['state']>>>;

type Equals<A, B> = A extends B ? (B extends A ? true : false) : false;
type Assert<T extends true> = T;

describe('store with 2 features', () => {
  describe('overrides should fail to compile', () => {
    test('state and computed', () => {
      const Store = signalStore(
        withState({ id: 1, name: 'hallo', other: 'hi' }),
        // @ts-expect-error other
        withComputed((store) => {
          return { other: computed(() => store.name()) };
        })
      );
    });

    test('2 states', () => {
      signalStore(
        withState({ id: 1, name: 'hallo', other: 'hi' }),
        // @ts-expect-error id | other
        withState({ id: 2, other: 'not allowed' })
      );
    });

    test('state and method', () => {
      const Overriding1c = signalStore(
        withState({ id: 1, name: 'hallo', prettyName: 'hi' }),
        // @ts-expect-error other
        withMethods((store) => {
          return {
            prettyName() {
              `${store.id()}: ${store.name()}`;
            },
          };
        })
      );
    });
  });

  describe('no overrides', () => {
    test('state and computed', () => {
      const NonOverriding1a = signalStore(
        withState({ id: 1, name: 'hallo', other: 'hi' }),
        withComputed((store) => {
          return {
            prettyName: computed(() => store.name()),
          };
        })
      );

      const store = new NonOverriding1a();
      type A1 = Assert<Equals<typeof store.id, Signal<number>>>;
      type A2 = Assert<Equals<typeof store.name, Signal<string>>>;
      type A3 = Assert<Equals<typeof store.prettyName, Signal<string>>>;
    });
  });
});

describe('store with 3 features', () => {
  describe('overrides should fail to compile', () => {
    test('state, computed and methods', () => {
      signalStore(
        withState({ id: 1, name: 'hallo', other: 'hi' }),
        withComputed((store) => {
          return {
            prettyName: computed(() => store.name()),
          };
        }),
        // @ts-expect-error prettyName
        withMethods((store) => {
          return {
            prettyName() {
              `${store.id()}: ${store.name()}`;
            },
          };
        })
      );
    });

    test('three states', () => {
      signalStore(
        withState({ id: 1, name: 'hallo', other: 'hi' }),
        withState({ key: '1' }),
        // @ts-expect-error overrides other
        withState({ other: '1' })
      );
    });

    test('state, methods and computed', () => {
      signalStore(
        withState({ id: 1, name: 'hallo', other: 'hi' }),
        withMethods((store) => {
          return {
            prettyName() {
              `${store.id()}: ${store.name()}`;
            },
          };
        }),
        // @ts-expect-error overrides prettyName
        withComputed((store) => {
          store;
          return {
            prettyName: computed(() => store.name()),
          };
        })
      );
    });
  });

  describe('no overrides', () => {
    test('state, computed, methods', () => {
      const Store = signalStore(
        withState({ id: 1, name: 'hallo', other: 'hi' }),
        withComputed((store) => {
          return {
            prettyName: computed(() => store.name()),
          };
        }),
        withMethods((store) => {
          return {
            log() {
              console.log(store.prettyName());
            },
          };
        })
      );

      const store = new Store();

      type A1 = Assert<Equals<typeof store.id, Signal<number>>>;
      type A2 = Assert<Equals<typeof store.name, Signal<string>>>;
      type A3 = Assert<Equals<typeof store.prettyName, Signal<string>>>;
      type A4 = Assert<Equals<typeof store.log, () => void>>;
    });

    test('triple state', () => {
      const Store = signalStore(
        withState({ id: 1, name: 'hallo' }),
        withState({ key: '1' }),
        withState({ entities: [1] })
      );

      const store = new Store();

      type A1 = Assert<Equals<typeof store.id, Signal<number>>>;
      type A2 = Assert<Equals<typeof store.name, Signal<string>>>;
      type A3 = Assert<Equals<typeof store.key, Signal<string>>>;
      type A4 = Assert<Equals<typeof store.entities, Signal<number[]>>>;
    });
  });
});

describe('overrides should work if enabled in config', () => {
  test('state, computed and methods', () => {
    signalStore(
      { allowOverrides: true, providedIn: 'root' },
      withState({ id: 1, name: 'hallo', other: 'hi' }),
      withComputed((store) => {
        return {
          prettyName: computed(() => store.name()),
        };
      }),
      withMethods((store) => {
        return {
          prettyName() {
            `${store.id()}: ${store.name()}`;
          },
        };
      })
    );
  });

  test('three states', () => {
    signalStore(
      { allowOverrides: true, providedIn: 'root' },
      withState({ id: 1, name: 'hallo', other: 'hi' }),
      withState({ key: '1' }),
      withState({ other: '1' })
    );
  });

  test('state, methods and computed', () => {
    signalStore(
      { allowOverrides: true, providedIn: 'root' },
      withState({ id: 1, name: 'hallo', other: 'hi' }),
      withMethods((store) => {
        return {
          prettyName() {
            `${store.id()}: ${store.name()}`;
          },
        };
      }),
      withComputed((store) => {
        store;
        return {
          prettyName: computed(() => store.name()),
        };
      })
    );
  });
});
