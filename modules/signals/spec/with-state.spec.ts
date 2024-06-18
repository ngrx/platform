import { isSignal, signal } from '@angular/core';
import { withComputed, withMethods, withState } from '../src';
import { STATE_SIGNAL } from '../src/state-signal';
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

    expect(Object.keys(store.stateSignals)).toEqual(['foo', 'x']);
    expect(Object.keys(initialStore.stateSignals)).toEqual([]);
  });

  it('creates deep signals for each state slice', () => {
    const initialStore = getInitialInnerStore();

    const store = withState({
      foo: 'bar',
      x: { y: 'z' },
    })(initialStore);

    expect(store.stateSignals.foo()).toBe('bar');
    expect(isSignal(store.stateSignals.foo)).toBe(true);

    expect(store.stateSignals.x()).toEqual({ y: 'z' });
    expect(isSignal(store.stateSignals.x)).toBe(true);

    expect(store.stateSignals.x.y()).toBe('z');
    expect(isSignal(store.stateSignals.x.y)).toBe(true);
  });

  it('patches state signal and creates deep signals for state slices provided via factory', () => {
    const initialStore = getInitialInnerStore();

    const store = withState(() => ({
      foo: 'bar',
      x: { y: 'z' },
    }))(initialStore);
    const state = store[STATE_SIGNAL]();

    expect(state).toEqual({ foo: 'bar', x: { y: 'z' } });
    expect(store.stateSignals.foo()).toBe('bar');
    expect(store.stateSignals.x()).toEqual({ y: 'z' });
    expect(store.stateSignals.x.y()).toBe('z');
  });

  it('overrides previously defined state signals, computed signals, and methods with the same name', () => {
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

    const store = withState(() => ({
      p2: 100,
      s2: 's2',
      m2: { m: 2 },
      p3: 'p3',
    }))(initialStore);

    expect(Object.keys(store.stateSignals)).toEqual([
      'p1',
      'p2',
      's2',
      'm2',
      'p3',
    ]);
    expect(store.stateSignals.p2()).toBe(100);

    expect(Object.keys(store.computedSignals)).toEqual(['s1']);
    expect(Object.keys(store.methods)).toEqual(['m1']);
  });
});
