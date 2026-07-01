import { Signal } from '@angular/core';
import { describe, expectTypeOf, it } from 'vitest';
import {
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

    expectTypeOf<CounterFeature>().toEqualTypeOf<{
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

    expectTypeOf<ContainerType>().toEqualTypeOf<{
      state: {};
      methods: {};
      props: { a: number };
    }>();
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
  });
});
