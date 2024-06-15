import { signal } from '@angular/core';
import { withComputed, withMethods, withState } from '../src';
import { getInitialInnerStore } from '../src/signal-store';

describe('withComputed', () => {
  it('adds signals to the store immutably', () => {
    const initialStore = getInitialInnerStore();

    const s1 = signal('s1').asReadonly();
    const s2 = signal(10).asReadonly();

    const store = withComputed(() => ({ s1, s2 }))(initialStore);

    expect(Object.keys(store.computedSignals)).toEqual(['s1', 's2']);
    expect(Object.keys(initialStore.computedSignals)).toEqual([]);

    expect(store.computedSignals.s1).toBe(s1);
    expect(store.computedSignals.s2).toBe(s2);
  });

  it('overrides previously defined slices, signals, and methods with the same name', () => {
    const initialStore = [
      withState({
        p1: 10,
        p2: 'p2',
      }),
      withComputed(() => ({
        s1: signal('s1').asReadonly(),
        s2: signal({ s: 2 }).asReadonly(),
      })),
      withMethods(() => ({
        m1() {},
        m2() {},
      })),
    ].reduce((acc, feature) => feature(acc), getInitialInnerStore());

    const s2 = signal(10).asReadonly();
    const store = withComputed(() => ({
      p1: signal('p1').asReadonly(),
      s2,
      m1: signal({ m: 1 }).asReadonly(),
      s3: signal({ s: 3 }).asReadonly(),
    }))(initialStore);

    expect(Object.keys(store.computedSignals)).toEqual([
      's1',
      's2',
      'p1',
      'm1',
      's3',
    ]);
    expect(store.computedSignals.s2).toBe(s2);

    expect(Object.keys(store.stateSignals)).toEqual(['p2']);
    expect(Object.keys(store.methods)).toEqual(['m2']);
  });
});
