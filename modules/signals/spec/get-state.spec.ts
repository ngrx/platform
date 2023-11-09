import { TestBed } from '@angular/core/testing';
import {
  getState,
  patchState,
  signalState,
  signalStore,
  withState,
} from '../src';
import { effect } from '@angular/core';

describe('getState', () => {
  const initialState = {
    user: {
      firstName: 'John',
      lastName: 'Smith',
    },
    foo: 'bar',
    numbers: [1, 2, 3],
    ngrx: 'signals',
  };

  describe('with signalStore', () => {
    it('returns the state object', () => {
      const Store = signalStore(withState(initialState));
      const store = new Store();

      expect(getState(store)).toEqual(initialState);
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
      expect(getState(store)).toEqual({ ...initialState, foo: 'baz' });
    });
  });
});
