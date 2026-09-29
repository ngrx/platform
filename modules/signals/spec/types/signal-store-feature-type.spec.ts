import { Signal } from '@angular/core';
import { describe, expectTypeOf, it } from 'vitest';
import {
  signalStore,
  signalStoreFeature,
  SignalStoreFeatureType,
  type,
  withMethods,
  withProps,
  withState,
} from '../../src';

describe('SignalStoreFeatureType', () => {
  function withCounter() {
    return signalStoreFeature(
      withState({ count: 0 }),
      withMethods(() => ({
        increment(): void {},
      }))
    );
  }

  it('uses extracted output as input for another custom feature', () => {
    type CounterFeature = SignalStoreFeatureType<typeof withCounter>;

    signalStoreFeature(
      type<CounterFeature>(),
      withMethods((store) => {
        expectTypeOf(store).toMatchObjectType<{
          count: Signal<number>;
          increment: () => void;
        }>();

        return {};
      })
    );
  });

  it('extracts the output result of a custom feature', () => {
    type CounterFeature = SignalStoreFeatureType<typeof withCounter>;

    expectTypeOf<CounterFeature>().toMatchObjectType<{
      state: { count: number };
      methods: { increment: () => void };
      props: {};
    }>();
  });

  it('extracts output from generic feature factories', () => {
    function withContainer<T>(initialValue: T) {
      return signalStoreFeature(withProps(() => ({ a: initialValue })));
    }

    type ContainerType = SignalStoreFeatureType<typeof withContainer<number>>;

    expectTypeOf<ContainerType>().toMatchObjectType<{
      state: {};
      methods: {};
      props: { a: number };
    }>();
  });

  it('preserves required input from custom features', () => {
    function withCounterLogger() {
      return signalStoreFeature(
        {
          state: type<{ count: number }>(),
          methods: type<{ increment: () => void }>(),
        },
        withMethods(({ count, increment }) => ({
          logAndIncrement(): void {
            console.log(count());
            increment();
          },
        }))
      );
    }

    type CounterLoggerFeature = SignalStoreFeatureType<
      typeof withCounterLogger
    >;

    expectTypeOf<CounterLoggerFeature>().toMatchObjectType<{
      state: { count: number };
      methods: {
        increment: () => void;
        logAndIncrement: () => void;
      };
      props: {};
    }>();

    signalStoreFeature(
      type<CounterLoggerFeature>(),
      withMethods((store) => {
        expectTypeOf(store).toMatchObjectType<{
          count: Signal<number>;
          increment: () => void;
          logAndIncrement: () => void;
        }>();

        return {};
      })
    );
  });

  describe('intersections', () => {
    function withContainer<T>(initialValue: T) {
      return signalStoreFeature(withProps(() => ({ a: initialValue })));
    }

    function withCounter() {
      return signalStoreFeature(
        withState({ count: 0 }),
        withMethods(() => ({
          increment(): void {},
        }))
      );
    }

    type CounterContainerFeature = SignalStoreFeatureType<typeof withCounter> &
      SignalStoreFeatureType<typeof withContainer<string>>;

    it('preserves state, props, and methods from intersected feature outputs', () => {
      expectTypeOf<CounterContainerFeature>().toMatchObjectType<{
        state: {
          count: number;
        };
        methods: {
          increment: () => void;
        };
        props: {
          a: string;
        };
      }>();
    });

    it('uses intersected feature outputs as input for another custom feature', () => {
      signalStoreFeature(
        type<CounterContainerFeature>(),
        withMethods((store) => {
          expectTypeOf(store).toMatchObjectType<{
            count: Signal<number>;
            increment: () => void;
            a: string;
          }>();

          return {};
        })
      );
    });

    it('uses inline', () => {
      signalStoreFeature(
        type<CounterContainerFeature & { state: { value: number } }>(),
        withMethods((store) => {
          expectTypeOf(store).toMatchObjectType<{
            count: Signal<number>;
            value: Signal<number>;
            increment: () => void;
            a: string;
          }>();

          return {};
        })
      );
    });

    it('intersects on the same member, which results in a never', () => {
      signalStoreFeature(
        type<CounterContainerFeature & { state: { count: string } }>(),
        withMethods((store) => {
          expectTypeOf(store.count).toEqualTypeOf<Signal<never>>();

          return {};
        })
      );
    });
  });

  it('ignores unresolved input from bare feature factories', () => {
    function withLogger() {
      return withMethods(() => ({ log(): void {} }));
    }

    signalStoreFeature(
      type<SignalStoreFeatureType<typeof withLogger>>(),
      withMethods((store) => {
        expectTypeOf(store.log).toEqualTypeOf<() => void>();
        // @ts-expect-error no Function index signature
        store.anythingAtAll();

        return {};
      })
    );
  });

  it('does a full check on the `signalStore` outcome', () => {
    function withCounterLogger() {
      return signalStoreFeature(
        type<SignalStoreFeatureType<typeof withCounter>>(),
        withMethods(({ count, increment }) => ({
          logAndIncrement(): void {
            increment();
          },
        }))
      );
    }

    const CounterStore = signalStore(withCounter(), withCounterLogger());

    expectTypeOf<InstanceType<typeof CounterStore>>().toMatchObjectType<{
      count: Signal<number>;
      increment: () => void;
      logAndIncrement: () => void;
    }>();
  });
});
