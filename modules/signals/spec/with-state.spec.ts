import { isSignal, signal } from '@angular/core';
import { withMethods, withSignals, withState } from '../src';
import { STATE_SIGNAL } from '../src/signal-state';
import { getInitialInnerStore } from '../src/signal-store';

describe('withState', () => {
  it('patches state signal and updates slices immutably', () => {
    const initialStore = getInitialInnerStore();
    const initialState = initialStore[STATE_SIGNAL]();

    const store = withState({
      foo: 'bar',
      x: { y: 'z' },
    })(initialStore);
    const state = store[STATE_SIGNAL]();

    expect(state).toEqual({ foo: 'bar', x: { y: 'z' } });
    expect(initialState).toEqual({});

    expect(Object.keys(store.slices)).toEqual(['foo', 'x']);
    expect(Object.keys(initialStore.slices)).toEqual([]);
  });

  it('creates deep signals for each state slice', () => {
    const initialStore = getInitialInnerStore();

    const store = withState({
      foo: 'bar',
      x: { y: 'z' },
    })(initialStore);

    expect(store.slices.foo()).toBe('bar');
    expect(isSignal(store.slices.foo)).toBe(true);

    expect(store.slices.x()).toEqual({ y: 'z' });
    expect(isSignal(store.slices.x)).toBe(true);

    expect(store.slices.x.y()).toBe('z');
    expect(isSignal(store.slices.x.y)).toBe(true);
  });

  it('patches state signal and creates deep signals for state slices provided via factory', () => {
    const initialStore = getInitialInnerStore();

    const store = withState(() => ({
      foo: 'bar',
      x: { y: 'z' },
    }))(initialStore);
    const state = store[STATE_SIGNAL]();

    expect(state).toEqual({ foo: 'bar', x: { y: 'z' } });
    expect(store.slices.foo()).toBe('bar');
    expect(store.slices.x()).toEqual({ y: 'z' });
    expect(store.slices.x.y()).toBe('z');
  });

  it('overrides previously defined state slices, signals, and methods with the same name', () => {
    const initialStore = [
      withState({
        p1: 10,
        p2: 'p2',
      }),
      withSignals(() => ({
        s1: signal('s1').asReadonly(),
        s2: signal({ s: 2 }).asReadonly(),
      })),
      withMethods(() => ({
        m1() {},
        m2() {},
      })),
    ].reduce((acc, feature) => feature(acc), getInitialInnerStore());

    const store = withState(() => ({
      p2: 100,
      s2: 's2',
      m2: { m: 2 },
      p3: 'p3',
    }))(initialStore);

    expect(Object.keys(store.slices)).toEqual(['p1', 'p2', 's2', 'm2', 'p3']);
    expect(store.slices.p2()).toBe(100);

    expect(Object.keys(store.signals)).toEqual(['s1']);
    expect(Object.keys(store.methods)).toEqual(['m1']);
  });
});
