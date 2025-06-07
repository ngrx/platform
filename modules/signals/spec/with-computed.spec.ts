import { computed, signal } from '@angular/core';
import {
  signalStoreFeature,
  withComputed,
  withMethods,
  withState,
} from '../src';
import { getInitialInnerStore } from '../src/signal-store';

describe('withComputed', () => {
  it('adds computed signals to the store immutably', () => {
    const initialStore = getInitialInnerStore();

    const s1 = signal('s1').asReadonly();
    const s2 = signal(10).asReadonly();

    const store = withComputed(() => ({ s1, s2 }))(initialStore);

    expect(Object.keys(store.props)).toEqual(['s1', 's2']);
    expect(Object.keys(initialStore.props)).toEqual([]);

    expect(store.props.s1).toBe(s1);
    expect(store.props.s2).toBe(s2);
  });

  it('logs warning if previously defined signal store members have the same name', () => {
    const COMPUTED_SECRET = Symbol('computed_secret');
    const initialStore = [
      withState({
        p1: 10,
        p2: 'p2',
      }),
      withComputed(() => ({
        s1: signal('s1').asReadonly(),
        s2: signal({ s: 2 }).asReadonly(),
        [COMPUTED_SECRET]: signal(1).asReadonly(),
      })),
      withMethods(() => ({
        m1() {},
        m2() {},
      })),
    ].reduce((acc, feature) => feature(acc), getInitialInnerStore());
    const s2 = signal(10).asReadonly();
    vi.spyOn(console, 'warn').mockImplementation(() => {});

    withComputed(() => ({
      p: signal(0).asReadonly(),
      p1: signal('p1').asReadonly(),
      s2,
      m1: signal({ m: 1 }).asReadonly(),
      m3: signal({ m: 3 }).asReadonly(),
      s3: signal({ s: 3 }).asReadonly(),
      [COMPUTED_SECRET]: signal(10).asReadonly(),
    }))(initialStore);

    expect(console.warn).toHaveBeenCalledWith(
      '@ngrx/signals: SignalStore members cannot be overridden.',
      'Trying to override:',
      'p1, s2, m1, Symbol(computed_secret)'
    );
  });

  it('adds computed automatically if the value is function', () => {
    const initialStore = getInitialInnerStore();

    const store = signalStoreFeature(
      withState({ a: 2, b: 3 }),
      withComputed(({ a, b }) => ({
        sum: () => a() + b(),
        product: () => a() * b(),
      }))
    )(initialStore);

    expect(store.props.sum()).toBe(5);
    expect(store.props.product()).toBe(6);
  });

  it('allows to mix user-provided computeds and automatically computed ones', () => {
    const initialStore = getInitialInnerStore();

    const store = signalStoreFeature(
      withState({ a: 2, b: 3 }),
      withComputed(({ a, b }) => ({
        sum: () => a() + b(),
        product: computed(() => a() * b()),
      }))
    )(initialStore);

    expect(store.props.sum()).toBe(5);
    expect(store.props.product()).toBe(6);
  });
});
