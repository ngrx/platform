import {
  createEnvironmentInjector,
  effect,
  EnvironmentInjector,
  Injectable,
} from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  getState,
  patchState,
  signalState,
  signalStore,
  watchState,
  withHooks,
  withMethods,
  withState,
} from '../src';
import { STATE_SOURCE } from '../src/state-source';
import { createLocalService } from './helpers';

describe('StateSource', () => {
  const initialState = {
    user: {
      firstName: 'John',
      lastName: 'Smith',
    },
    foo: 'bar',
    numbers: [1, 2, 3],
    ngrx: 'signals',
  };

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

          expect(state[STATE_SOURCE]()).toEqual({
            ...initialState,
            user: { firstName: 'Johannes', lastName: 'Schmidt' },
            foo: 'baz',
          });
        });

        it('patches state via updater function', () => {
          const state = stateFactory();

          patchState(state, (state) => ({
            numbers: [...state.numbers, 4],
            ngrx: 'rocks',
          }));

          expect(state[STATE_SOURCE]()).toEqual({
            ...initialState,
            numbers: [1, 2, 3, 4],
            ngrx: 'rocks',
          });
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

          expect(state[STATE_SOURCE]()).toEqual({
            ...initialState,
            user: { firstName: 'Jovan', lastName: 'Schmidt' },
            foo: 'foo',
            numbers: [1, 2, 3, 4],
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

        TestBed.flushEffects();
        expect(executionCount).toBe(1);

        store.setFoo('baz');

        TestBed.flushEffects();
        expect(executionCount).toBe(2);
      });
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
