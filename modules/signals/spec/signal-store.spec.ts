import { inject, InjectionToken, isSignal, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  signalStore,
  withHooks,
  withMethods,
  withSignals,
  withState,
} from '../src';
import { STATE_SIGNAL } from '../src/signal-state';
import { createLocalService } from './helpers';

describe('signalStore', () => {
  describe('creation', () => {
    it('creates a store via new operator', () => {
      const Store = signalStore(withState({}));

      const store = new Store();
      const stateSignal = store[STATE_SIGNAL];

      expect(isSignal(stateSignal)).toBe(true);
      expect(typeof stateSignal.update === 'function').toBe(true);
      expect(stateSignal()).toEqual({});
    });

    it('creates a store as injectable service', () => {
      const Store = signalStore(withState({}));

      TestBed.configureTestingModule({ providers: [Store] });
      const store = TestBed.inject(Store);
      const stateSignal = store[STATE_SIGNAL];

      expect(isSignal(stateSignal)).toBe(true);
      expect(typeof stateSignal.update === 'function').toBe(true);
      expect(stateSignal()).toEqual({});
    });

    it('creates a store that is provided in root when providedIn option is specified', () => {
      const Store = signalStore({ providedIn: 'root' }, withState({}));

      const store1 = TestBed.inject(Store);
      const store2 = TestBed.inject(Store);
      const stateSignal = store1[STATE_SIGNAL];

      expect(store1).toBe(store2);
      expect(isSignal(stateSignal)).toBe(true);
      expect(typeof stateSignal.update === 'function').toBe(true);
      expect(stateSignal()).toEqual({});
    });
  });

  describe('withState', () => {
    it('adds deep signals to the store for each state slice', () => {
      const Store = signalStore(
        withState({
          foo: 'foo',
          x: { y: { z: 10 } },
        })
      );

      const store = new Store();

      expect(store[STATE_SIGNAL]()).toEqual({
        foo: 'foo',
        x: { y: { z: 10 } },
      });
      expect(store.foo()).toBe('foo');
      expect(store.x()).toEqual({ y: { z: 10 } });
      expect(store.x.y()).toEqual({ z: 10 });
      expect(store.x.y.z()).toBe(10);
    });

    it('executes withState factory in injection context', () => {
      const TOKEN = new InjectionToken('TOKEN', {
        providedIn: 'root',
        factory: () => ({ foo: 'foo' }),
      });
      const Store = signalStore(withState(() => inject(TOKEN)));

      TestBed.configureTestingModule({ providers: [Store] });
      const store = TestBed.inject(Store);

      expect(store.foo()).toBe('foo');
    });
  });

  describe('withSignals', () => {
    it('provides previously defined state slices and computed signals as input argument', () => {
      const Store = signalStore(
        withState(() => ({ foo: 'foo' })),
        withSignals(() => ({ bar: signal('bar').asReadonly() })),
        withSignals(({ foo, bar }) => {
          expect(foo()).toBe('foo');
          expect(bar()).toBe('bar');

          return { baz: signal('baz').asReadonly() };
        })
      );

      const store = new Store();

      expect(store[STATE_SIGNAL]()).toEqual({ foo: 'foo' });
      expect(store.foo()).toBe('foo');
      expect(store.bar()).toBe('bar');
      expect(store.baz()).toBe('baz');
    });

    it('executes withSignals factory in injection context', () => {
      const TOKEN = new InjectionToken('TOKEN', {
        providedIn: 'root',
        factory: () => ({ bar: signal('bar').asReadonly() }),
      });
      const Store = signalStore(withSignals(() => inject(TOKEN)));

      TestBed.configureTestingModule({ providers: [Store] });
      const store = TestBed.inject(Store);

      expect(store.bar()).toBe('bar');
    });
  });

  describe('withMethods', () => {
    it('provides previously defined store properties as an input argument', () => {
      const Store = signalStore(
        withState(() => ({ foo: 'foo' })),
        withSignals(() => ({ bar: signal('bar').asReadonly() })),
        withMethods(() => ({ baz: () => 'baz' })),
        withMethods((store) => {
          expect(store[STATE_SIGNAL]()).toEqual({ foo: 'foo' });
          expect(store.foo()).toBe('foo');
          expect(store.bar()).toBe('bar');
          expect(store.baz()).toBe('baz');

          return { m: () => 'm' };
        })
      );

      const store = new Store();

      expect(store[STATE_SIGNAL]()).toEqual({ foo: 'foo' });
      expect(store.foo()).toBe('foo');
      expect(store.bar()).toBe('bar');
      expect(store.baz()).toBe('baz');
      expect(store.m()).toBe('m');
    });

    it('executes withMethods factory in injection context', () => {
      const TOKEN = new InjectionToken('TOKEN', {
        providedIn: 'root',
        factory: () => ({ baz: () => 'baz' }),
      });
      const Store = signalStore(withMethods(() => inject(TOKEN)));

      TestBed.configureTestingModule({ providers: [Store] });
      const store = TestBed.inject(Store);

      expect(store.baz()).toBe('baz');
    });
  });

  describe('withHooks', () => {
    it('calls onInit hook on store init', () => {
      let message = '';
      const Store = signalStore(
        withHooks({
          onInit() {
            message = 'onInit';
          },
        })
      );

      new Store();

      expect(message).toBe('onInit');

      message = '';
      TestBed.configureTestingModule({ providers: [Store] });
      TestBed.inject(Store);

      expect(message).toBe('onInit');
    });

    it('calls onDestroy hook on store destroy', () => {
      let message = '';
      const Store = signalStore(
        withHooks({
          onDestroy() {
            message = 'onDestroy';
          },
        })
      );

      createLocalService(Store).destroy();

      expect(message).toBe('onDestroy');
    });

    it('provides previously defined store properties as onInit input argument', () => {
      let message = '';
      const Store = signalStore(
        withState(() => ({ foo: 'foo' })),
        withSignals(() => ({ bar: signal('bar').asReadonly() })),
        withMethods(() => ({ baz: () => 'baz' })),
        withHooks({
          onInit(store) {
            expect(store[STATE_SIGNAL]()).toEqual({ foo: 'foo' });
            expect(store.foo()).toBe('foo');
            expect(store.bar()).toBe('bar');
            expect(store.baz()).toBe('baz');
            message = 'onInit';
          },
        })
      );

      new Store();

      expect(message).toBe('onInit');
    });

    it('provides previously defined store properties as onDestroy input argument', () => {
      let message = '';
      const Store = signalStore(
        withState(() => ({ foo: 'foo' })),
        withSignals(() => ({ bar: signal('bar').asReadonly() })),
        withMethods(() => ({ baz: () => 'baz' })),
        withHooks({
          onDestroy(store) {
            expect(store.foo()).toBe('foo');
            expect(store.bar()).toBe('bar');
            expect(store.baz()).toBe('baz');
            message = 'onDestroy';
          },
        })
      );

      createLocalService(Store).destroy();

      expect(message).toBe('onDestroy');
    });

    it('executes hooks in injection context', () => {
      const messages: string[] = [];
      const TOKEN = new InjectionToken('TOKEN', {
        providedIn: 'root',
        factory: () => 'ngrx',
      });
      const Store = signalStore(
        withHooks({
          onInit() {
            inject(TOKEN);
            messages.push('onInit');
          },
          onDestroy() {
            inject(TOKEN);
            messages.push('onDestroy');
          },
        })
      );
      const { destroy } = createLocalService(Store);

      expect(messages).toEqual(['onInit']);

      destroy();
      expect(messages).toEqual(['onInit', 'onDestroy']);
    });
  });

  describe('composition', () => {
    it('overrides previously defined store properties immutably', () => {
      const Store = signalStore(
        withState({ i: 1, j: 2, k: 3, l: 4 }),
        withSignals(({ i, j, k, l }) => {
          expect(i()).toBe(1);
          expect(j()).toBe(2);
          expect(k()).toBe(3);
          expect(l()).toBe(4);

          return {
            l: signal('l').asReadonly(),
            m: signal('m').asReadonly(),
          };
        }),
        withMethods((store) => {
          expect(store.i()).toBe(1);
          expect(store.j()).toBe(2);
          expect(store.k()).toBe(3);
          expect(store.l()).toBe('l');
          expect(store.m()).toBe('m');

          return {
            j: () => 'j',
            m: () => true,
            n: (value: number) => value,
          };
        })
      );

      const store = new Store();

      expect(store.i()).toBe(1);
      expect(store.j()).toBe('j');
      expect(store.k()).toBe(3);
      expect(store.l()).toBe('l');
      expect(store.m()).toBe(true);
      expect(store.n(10)).toBe(10);
    });
  });
});
