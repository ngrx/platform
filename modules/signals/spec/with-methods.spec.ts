import { signal } from '@angular/core';
import { withComputed, withMethods, withState } from '../src';
import { getInitialInnerStore } from '../src/signal-store';

describe('withMethods', () => {
  it('adds methods to the store immutably', () => {
    const initialStore = getInitialInnerStore();

    const m1 = () => 100;
    const m2 = () => 'm2';

    const store = withMethods(() => ({ m1, m2 }))(initialStore);

    expect(Object.keys(store.methods)).toEqual(['m1', 'm2']);
    expect(Object.keys(initialStore.methods)).toEqual([]);

    expect(store.methods.m1).toBe(m1);
    expect(store.methods.m2).toBe(m2);
  });

  it('overrides previously defined state signals, computed signals, and methods with the same name', () => {
    const initialStore = [
      withState({
        p1: 'p1',
        p2: false,
      }),
      withComputed(() => ({
        s1: signal(true).asReadonly(),
        s2: signal({ s: 2 }).asReadonly(),
      })),
      withMethods(() => ({
        m1() {},
        m2() {},
      })),
    ].reduce((acc, feature) => feature(acc), getInitialInnerStore());

    const m2 = () => 10;
    const store = withMethods(() => ({
      p2() {},
      s1: () => 100,
      m2,
      m3: () => 'm3',
    }))(initialStore);

    expect(Object.keys(store.methods)).toEqual(['m1', 'm2', 'p2', 's1', 'm3']);
    expect(store.methods.m2).toBe(m2);

    expect(Object.keys(store.stateSignals)).toEqual(['p1']);
    expect(Object.keys(store.computedSignals)).toEqual(['s2']);
  });
});
