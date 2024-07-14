import { effect } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  getState,
  patchState,
  signalState,
  signalStore,
  withState,
} from '../src';
import { STATE_SOURCE } from '../src/state-source';

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
          const SignalStore = signalStore(withState(initialState));
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
      it('returns the state object', () => {
        const Store = signalStore(withState(initialState));
        const store = new Store();

        expect(getState(store)).toEqual(initialState);

        patchState(store, { foo: 'baz' });

        expect(getState(store)).toEqual({ ...initialState, foo: 'baz' });
      });

      it('executes in the reactive context', () => {
        const Store = signalStore(withState(initialState));
        const store = new Store();

        let executionCount = 0;

        TestBed.runInInjectionContext(() => {
          effect(() => {
            getState(store);
            executionCount++;
          });
        });

        TestBed.flushEffects();
        expect(executionCount).toBe(1);

        patchState(store, { foo: 'baz' });

        TestBed.flushEffects();
        expect(executionCount).toBe(2);
      });
    });
  });
});
