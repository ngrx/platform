import { computed, isSignal, linkedSignal, signal } from '@angular/core';
import { withComputed, withMethods, withState } from '../src';
import { getInitialInnerStore } from '../src/signal-store';
import { getState, STATE_SOURCE } from '../src/state-source';

describe('withState', () => {
  it('patches state source and updates slices immutably', () => {
    const initialStore = getInitialInnerStore();
    const initialState = getState(initialStore);

    const store = withState({
      foo: 'bar',
      x: { y: 'z' },
    })(initialStore);
    const state = getState(store);

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

  it('patches state source and creates deep signals for state slices provided via factory', () => {
    const initialStore = getInitialInnerStore();

    const store = withState(() => ({
      foo: 'bar',
      x: { y: 'z' },
    }))(initialStore);
    const state = getState(store);

    expect(state).toEqual({ foo: 'bar', x: { y: 'z' } });
    expect(store.stateSignals.foo()).toBe('bar');
    expect(store.stateSignals.x()).toEqual({ y: 'z' });
    expect(store.stateSignals.x.y()).toBe('z');
  });

  it('logs warning if previously defined signal store members have the same name', () => {
    const COMPUTED_SECRET = Symbol('computed_secret');
    const METHOD_SECRET = Symbol('method_secret');
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
        [METHOD_SECRET]() {},
      })),
    ].reduce((acc, feature) => feature(acc), getInitialInnerStore());
    vi.spyOn(console, 'warn').mockImplementation(() => {});

    withState(() => ({
      p2: 100,
      s: 's',
      s2: 's2',
      m: { s: 10 },
      m2: { m: 2 },
      p3: 'p3',
      [COMPUTED_SECRET]: 10,
      [METHOD_SECRET]: 100,
    }))(initialStore);

    expect(console.warn).toHaveBeenCalledWith(
      '@ngrx/signals: SignalStore members cannot be overridden.',
      'Trying to override:',
      'p2, s2, m2, Symbol(computed_secret), Symbol(method_secret)'
    );
  });

  it('allows to pass user-defined WritableSignals', () => {
    const user = signal({ firstName: 'John', lastName: 'Doe' });
    const initialStore = getInitialInnerStore();

    const store = withState(() => ({
      user,
    }))(initialStore);

    expect(store[STATE_SOURCE]['user']).toBe(user);
  });

  it('allows to pass mixed signals and plain values', () => {
    const user = signal({ firstName: 'John', lastName: 'Doe' });
    const address = computed(() => ({
      street: '123 Main St',
      city: 'Anytown',
    }));
    const age = linkedSignal(() => 30);

    const initialStore = getInitialInnerStore();

    const store = withState(() => ({
      user,
      address,
      age,
      isAdmin: false,
    }))(initialStore);

    expect(store[STATE_SOURCE]['user']).toBe(user);
    expect(store[STATE_SOURCE]['address']).not.toBe(address);
    expect(store[STATE_SOURCE]['age']).toBe(age);
    expect(store[STATE_SOURCE]['isAdmin']()).toBe(false);
  });
});
