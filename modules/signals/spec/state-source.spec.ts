import {
  createEnvironmentInjector,
  effect,
  EnvironmentInjector,
  Injectable,
  signal,
} from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  getState,
  isWritableStateSource,
  patchState,
  signalState,
  signalStore,
  StateSource,
  watchState,
  withHooks,
  withMethods,
  withState,
} from '../src';
import { STATE_SOURCE } from '../src/state-source';
import { assertStateSource, createLocalService } from './helpers';

const SECRET = Symbol('SECRET');

describe('StateSource', () => {
  const initialState = {
    user: {
      firstName: 'John',
      lastName: 'Smith',
    },
    foo: 'bar',
    numbers: [1, 2, 3],
    ngrx: 'signals',
    [SECRET]: 'secret',
  };

  const consoleWarnSpy = vi.spyOn(console, 'warn');

  beforeEach(() => {
    consoleWarnSpy.mockClear();
  });

  describe('isWritableStateSource', () => {
    it('returns true for a writable StateSource', () => {
      const stateSource: StateSource<{ value: typeof initialState }> = {
        [STATE_SOURCE]: { value: signal(initialState) },
      };

      expect(isWritableStateSource(stateSource)).toBe(true);
    });

    it('returns false for a readonly StateSource', () => {
      const stateSource: StateSource<{ value: typeof initialState }> = {
        [STATE_SOURCE]: { value: signal(initialState).asReadonly() },
      };

      expect(isWritableStateSource(stateSource)).toBe(false);
    });
  });

  describe('patchState', () => {
    [
      {
        name: 'with signalState',
        stateFactory: () => signalState(initialState),
      },
      {
        name: 'with signalStore',
        stateFactory: () => {
          const SignalStore = signalStore(
            { protectedState: false },
            withState(initialState)
          );

          return new SignalStore();
        },
      },
    ].forEach(({ name, stateFactory }) => {
      describe(name, () => {
        it('patches state via partial state object', () => {
          const state = stateFactory();

          patchState(state, {
            user: { firstName: 'Johannes', lastName: 'Schmidt' },
            foo: 'baz',
          });

          assertStateSource(state[STATE_SOURCE], {
            user: signal({ firstName: 'Johannes', lastName: 'Schmidt' }),
            foo: signal('baz'),
            numbers: signal([1, 2, 3]),
            ngrx: signal('signals'),
            [SECRET]: signal('secret'),
          });
        });

        it('patches state via updater function', () => {
          const state = stateFactory();

          patchState(state, (state) => ({
            numbers: [...state.numbers, 4],
            ngrx: 'rocks',
          }));

          assertStateSource(state[STATE_SOURCE], {
            user: signal({ firstName: 'John', lastName: 'Smith' }),
            foo: signal('bar'),
            numbers: signal([1, 2, 3, 4]),
            ngrx: signal('rocks'),
            [SECRET]: signal('secret'),
          });
        });

        it('patches state slice with symbol key', () => {
          const state = stateFactory();

          patchState(state, { [SECRET]: 'another secret' });
          expect(state[SECRET]()).toBe('another secret');
        });

        it('patches state via sequence of partial state objects and updater functions', () => {
          const state = stateFactory();

          patchState(
            state,
            { user: { firstName: 'Johannes', lastName: 'Schmidt' } },
            (state) => ({ numbers: [...state.numbers, 4], foo: 'baz' }),
            (state) => ({ user: { ...state.user, firstName: 'Jovan' } }),
            { foo: 'foo' }
          );

          assertStateSource(state[STATE_SOURCE], {
            user: signal({ firstName: 'Jovan', lastName: 'Schmidt' }),
            foo: signal('foo'),
            numbers: signal([1, 2, 3, 4]),
            ngrx: signal('signals'),
            [SECRET]: signal('secret'),
          });
        });

        it('patches state immutably', () => {
          const state = stateFactory();

          patchState(state, {
            foo: 'bar',
            numbers: [3, 2, 1],
            ngrx: 'rocks',
          });

          expect(state.user()).toBe(initialState.user);
          expect(state.foo()).toBe(initialState.foo);
          expect(state.numbers()).not.toBe(initialState.numbers);
          expect(state.ngrx()).not.toBe(initialState.ngrx);
        });
      });
    });

    describe('undefined root properties', () => {
      it('skips and warns on optional root properties, when they are missing in the init state', () => {
        type UserState = {
          id: number;
          middleName?: string;
        };
        const initialState: UserState = { id: 1 };
        const userState = signalState(initialState);

        patchState(userState, { middleName: 'Michael' });

        expect(consoleWarnSpy).toHaveBeenCalledWith(
          "@ngrx/signals: patchState was called with an unknown state slice 'middleName'.",
          'Ensure that all state properties are explicitly defined in the initial state.',
          'Updates to properties not present in the initial state will be ignored.'
        );
        expect(userState()).toEqual({ id: 1 });
      });

      it('updates optional properties with an initialized value', () => {
        type UserState = {
          id: number;
          middleName?: string;
        };
        const initialState: UserState = { id: 1, middleName: 'Michael' };
        const userState = signalState(initialState);

        patchState(userState, { middleName: undefined });
        expect(userState()).toEqual({ id: 1, middleName: undefined });

        patchState(userState, { middleName: 'Martin' });
        expect(userState()).toEqual({ id: 1, middleName: 'Martin' });

        expect(consoleWarnSpy).not.toHaveBeenCalled();
      });

      it('supports root properties with union type of undefined and does not warn', () => {
        type UserState = {
          id: number;
          middleName: string | undefined;
        };
        const initialState: UserState = { id: 1, middleName: undefined };
        const userState = signalState(initialState);

        patchState(userState, { middleName: 'Michael' });

        expect(userState()).toEqual({ id: 1, middleName: 'Michael' });
        expect(consoleWarnSpy).not.toHaveBeenCalled();
      });
    });

    it('sets only root properties which values have changed (equal check)', () => {
      const UserStore = signalStore(
        { providedIn: 'root', protectedState: false },
        withState({
          user: { firstName: 'John', lastName: 'Smith' },
          city: 'Changan',
        })
      );
      const store = TestBed.inject(UserStore);
      let userChangedCount = 0;
      TestBed.runInInjectionContext(() => {
        effect(() => {
          store.user();
          userChangedCount++;
        });
      });

      TestBed.tick();
      expect(userChangedCount).toBe(1);

      patchState(store, { city: 'Xian' });
      TestBed.tick();
      expect(userChangedCount).toBe(1);

      patchState(store, (state) => state);
      TestBed.tick();
      expect(userChangedCount).toBe(1);

      patchState(store, ({ user }) => ({ user }));
      TestBed.tick();
      expect(userChangedCount).toBe(1);

      patchState(store, ({ user }) => ({
        user: { ...user, firstName: 'Jane' },
      }));
      TestBed.tick();
      expect(userChangedCount).toBe(2);
    });
  });

  describe('getState', () => {
    describe('with signalStore', () => {
      function storeFactory() {
        const Store = signalStore(
          withState(initialState),
          withMethods((store) => ({
            setFoo(foo: string): void {
              patchState(store, { foo });
            },
          }))
        );

        return new Store();
      }

      it('returns the state object', () => {
        const store = storeFactory();

        expect(getState(store)).toEqual(initialState);

        store.setFoo('baz');

        expect(getState(store)).toEqual({ ...initialState, foo: 'baz' });
      });

      it('executes in the reactive context', () => {
        const store = storeFactory();
        let executionCount = 0;

        TestBed.runInInjectionContext(() => {
          effect(() => {
            getState(store);
            executionCount++;
          });
        });

        TestBed.tick();
        expect(executionCount).toBe(1);

        store.setFoo('baz');

        TestBed.tick();
        expect(executionCount).toBe(2);
      });
    });

    it('does not support a dynamic dictionary as state', () => {
      const Store = signalStore(
        { providedIn: 'root' },
        withState<Record<number, number>>({}),
        withMethods((store) => ({
          addNumber(num: number): void {
            patchState(store, {
              [num]: num,
            });
          },
        }))
      );
      const store = TestBed.inject(Store);

      store.addNumber(1);
      store.addNumber(2);
      store.addNumber(3);

      expect(getState(store)).toEqual({});
    });
  });

  describe('watchState', () => {
    describe('with signalState', () => {
      it('watches state changes', () => {
        const state = signalState({ count: 0 });
        const stateHistory: number[] = [];

        TestBed.runInInjectionContext(() => {
          watchState(state, (state) => stateHistory.push(state.count));
        });

        patchState(state, { count: 1 });
        patchState(state, { count: 2 });
        patchState(state, { count: 3 });

        expect(stateHistory).toEqual([0, 1, 2, 3]);
      });

      it('stops watching on injector destroy', () => {
        const stateHistory: number[] = [];
        const state = signalState({ count: 0 });

        @Injectable()
        class TestService {
          constructor() {
            watchState(state, (state) => stateHistory.push(state.count));
          }
        }

        const { destroy } = createLocalService(TestService);

        patchState(state, { count: 1 });

        destroy();

        patchState(state, { count: 2 });
        patchState(state, { count: 3 });

        expect(stateHistory).toEqual([0, 1]);
      });

      it('stops watching on manual destroy', () => {
        const state = signalState({ count: 0 });
        const stateHistory: number[] = [];

        const { destroy } = TestBed.runInInjectionContext(() =>
          watchState(state, (state) => stateHistory.push(state.count))
        );

        patchState(state, { count: 1 });
        patchState(state, { count: 2 });

        destroy();

        patchState(state, { count: 3 });

        expect(stateHistory).toEqual([0, 1, 2]);
      });

      it('stops watching on provided injector destroy', () => {
        const injector1 = createEnvironmentInjector(
          [],
          TestBed.inject(EnvironmentInjector)
        );
        const injector2 = createEnvironmentInjector(
          [],
          TestBed.inject(EnvironmentInjector)
        );
        const state = signalState({ count: 0 });
        const stateHistory1: number[] = [];
        const stateHistory2: number[] = [];

        watchState(state, (state) => stateHistory1.push(state.count), {
          injector: injector1,
        });
        watchState(state, (state) => stateHistory2.push(state.count), {
          injector: injector2,
        });

        patchState(state, { count: 1 });
        patchState(state, { count: 2 });

        injector1.destroy();

        patchState(state, { count: 3 });

        injector2.destroy();

        patchState(state, { count: 4 });

        expect(stateHistory1).toEqual([0, 1, 2]);
        expect(stateHistory2).toEqual([0, 1, 2, 3]);
      });

      it('throws an error when called out of injection context', () => {
        expect(() => watchState(signalState({}), () => {})).toThrow(
          /NG0203: watchState\(\) can only be used within an injection context/
        );
      });
    });

    describe('with signalStore', () => {
      it('watches state changes when used within the store', () => {
        const stateHistory: number[] = [];
        const CounterStore = signalStore(
          withState({ count: 0 }),
          withHooks({
            onInit(store) {
              patchState(store, { count: 1 });

              watchState(store, (state) => stateHistory.push(state.count));

              patchState(store, { count: 2 });
              patchState(store, { count: 3 });
            },
          })
        );

        TestBed.configureTestingModule({ providers: [CounterStore] });
        TestBed.inject(CounterStore);

        expect(stateHistory).toEqual([1, 2, 3]);
      });

      it('watches state changes when used outside of store', () => {
        const stateHistory: number[] = [];
        const CounterStore = signalStore(
          withState({ count: 0 }),
          withMethods((store) => ({
            increment(): void {
              patchState(store, (state) => ({ count: state.count + 1 }));
            },
          }))
        );

        TestBed.configureTestingModule({ providers: [CounterStore] });
        const store = TestBed.inject(CounterStore);
        const injector = TestBed.inject(EnvironmentInjector);

        watchState(store, (state) => stateHistory.push(state.count), {
          injector,
        });

        store.increment();
        store.increment();
        store.increment();

        expect(stateHistory).toEqual([0, 1, 2, 3]);
      });
    });
  });
});
