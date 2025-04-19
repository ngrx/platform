import {
  computed,
  isSignal,
  linkedSignal,
  resource,
  signal,
} from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { withComputed, withMethods, withState } from '../src';
import { getInitialInnerStore, signalStore } from '../src/signal-store';
import { getState, patchState } from '../src/state-source';

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

  describe('integrates writable Signals natively', () => {
    it('integrates writable Signals as-is', () => {
      const user = {
        id: 1,
        name: 'John Doe',
      };
      const userSignal = signal(user);
      const Store = signalStore(
        { providedIn: 'root', protectedState: false },
        withState({
          user: userSignal,
        }),
        withComputed(({ user: { id, name } }) => ({
          prettyName: computed(() => `${name()} ${id()}`),
        }))
      );
      const store = TestBed.inject(Store);

      expect(store.user()).toBe(user);
      expect(store.prettyName()).toBe('John Doe 1');

      userSignal.set({ id: 2, name: 'Jane Doe' });
      expect(store.user()).toEqual({ id: 2, name: 'Jane Doe' });

      patchState(store, { user: { id: 3, name: 'Jack Doe' } });
      expect(store.user()).toEqual({ id: 3, name: 'Jack Doe' });
    });

    it('integrates a linkedSignal and its upate mechanism', () => {
      const triggerSignal = signal(1);
      const userLinkedSignal = linkedSignal({
        source: triggerSignal,
        computation: () => ({ id: 1, name: 'John Doe' }),
      });

      const Store = signalStore(
        { providedIn: 'root' },
        withState({
          user: userLinkedSignal,
        }),
        withComputed(({ user: { id, name } }) => ({
          prettyName: computed(() => `${name()} ${id()}`),
        }))
      );
      const store = TestBed.inject(Store);

      expect(store.user()).toEqual({ id: 1, name: 'John Doe' });
      expect(store.prettyName()).toBe('John Doe 1');

      patchState(store, { user: { id: 2, name: 'Jane Doe' } });
      expect(store.prettyName()).toBe('Jane Doe 2');

      triggerSignal.set(2);
      expect(store.prettyName()).toBe('John Doe 1');
    });

    it('supports a resource', async () => {
      const resourceTrigger = signal(1);
      const userResource = TestBed.runInInjectionContext(() =>
        resource({
          request: resourceTrigger,
          loader: (params) =>
            Promise.resolve({ id: params.request, name: 'John Doe' }),
          defaultValue: { id: 0, name: 'Loading...' },
        })
      );
      const Store = signalStore(
        { providedIn: 'root', protectedState: false },
        withState({
          user: userResource.value,
        }),
        withComputed(({ user: { id, name } }) => ({
          prettyName: computed(() => `${name()} ${id()}`),
        }))
      );
      const store = TestBed.inject(Store);

      expect(store.user()).toEqual({ id: 0, name: 'Loading...' });

      await new Promise((resolve) => setTimeout(resolve));
      expect(store.user()).toEqual({ id: 1, name: 'John Doe' });

      resourceTrigger.set(2);
      await new Promise((resolve) => setTimeout(resolve));
      expect(store.user()).toEqual({ id: 2, name: 'John Doe' });
    });

    it('allows mixed writable Signal Types', () => {
      const user = {
        id: 1,
        name: 'John Doe',
      };
      const userSignal = signal(user);
      const product = { id: 1, name: 'Product A' };
      const Store = signalStore(
        { providedIn: 'root', protectedState: false },
        withState({
          user: userSignal,
          product,
        })
      );
      const store = TestBed.inject(Store);

      expect(store.user()).toBe(user);
      expect(store.product()).toBe(product);
    });

    it('does not strip a readonly Signal', () => {
      const Store = signalStore(
        { providedIn: 'root' },
        withState({
          number: signal(1).asReadonly(),
        })
      );
      const store = TestBed.inject(Store);

      expect(isSignal(store.number())).toBe(true);
      expect(store.number()()).toBe(1);
    });

    it('does not strip a nested writable Signal', () => {
      const user = {
        id: 1,
        name: 'John Doe',
      };
      const userSignal = signal(user);
      const Store = signalStore(
        { providedIn: 'root' },
        withState({
          data: {
            user: userSignal,
          },
        })
      );
      const store = TestBed.inject(Store);

      expect(isSignal(store.data.user())).toBe(true);
    });
  });
});
