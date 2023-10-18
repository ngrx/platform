import { computed, Signal, signal } from '@angular/core';
import {
  signalStore,
  signalStoreFeature,
  type,
  withComputed,
  withMethods,
  withState,
} from '../src';
import { STATE_SIGNAL } from '../src/signal-state';

describe('signalStoreFeature', () => {
  function withCustomFeature1() {
    return signalStoreFeature(
      withState({ foo: 'foo' }),
      withComputed(({ foo }) => ({ bar: computed(() => foo() + 1) })),
      withMethods(({ foo, bar }) => ({
        baz: () => foo() + bar() + 2,
      }))
    );
  }

  function withCustomFeature2() {
    return signalStoreFeature(
      withCustomFeature1(),
      withMethods(({ foo, baz }) => ({
        bar: (value: number) => value,
        m: () => foo() + baz() + 3,
      }))
    );
  }

  function withCustomFeatureWithInput<_>() {
    return signalStoreFeature(
      {
        state: type<{ foo: string }>(),
        signals: type<{ s: Signal<number> }>(),
      },
      withState({ foo1: 1 }),
      withState({ foo2: 2 })
    );
  }

  it('creates a custom feature by combining base features', () => {
    const Store = signalStore(
      withCustomFeature1(),
      withComputed(({ bar }) => ({
        s: computed(() => bar() + 's'),
      }))
    );

    const store = new Store();

    expect(store[STATE_SIGNAL]()).toEqual({ foo: 'foo' });
    expect(store.foo()).toBe('foo');
    expect(store.bar()).toBe('foo1');
    expect(store.baz()).toBe('foofoo12');
    expect(store.s()).toBe('foo1s');
  });

  it('creates a custom feature by combining base and custom features', () => {
    const Store = signalStore(
      withCustomFeature2(),
      withMethods(({ foo }) => ({ m1: () => foo() + 10 }))
    );

    const store = new Store();

    expect(store[STATE_SIGNAL]()).toEqual({ foo: 'foo' });
    expect(store.foo()).toBe('foo');
    expect(store.bar(10)).toBe(10);
    expect(store.m()).toBe('foofoofoo123');
    expect(store.m1()).toBe('foo10');
  });

  it('creates a custom feature with input', () => {
    const Store = signalStore(
      withCustomFeature1(),
      withComputed(() => ({ s: signal(1).asReadonly() })),
      withCustomFeatureWithInput()
    );

    const store = new Store();

    expect(store[STATE_SIGNAL]()).toEqual({ foo: 'foo', foo1: 1, foo2: 2 });
    expect(store.foo()).toBe('foo');
    expect(store.bar()).toBe('foo1');
    expect(store.baz()).toBe('foofoo12');
    expect(store.s()).toBe(1);
    expect(store.foo1()).toBe(1);
    expect(store.foo2()).toBe(2);
  });
});
