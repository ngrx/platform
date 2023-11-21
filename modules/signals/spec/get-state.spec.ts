import { computed, effect } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  getState,
  patchState,
  signalStore,
  withComputed,
  withState,
} from '../src';

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

    it('outputs the values of computed signals', () => {
      const Store = signalStore(
        withState(initialState),
        withComputed((store) => ({
          fullName: computed(
            () => `${store.user.firstName()} ${store.user.lastName()}`
          ),
        }))
      );
      const store = new Store();

      expect(getState(store)).toEqual({
        ...initialState,
        fullName: 'John Smith',
      });

      patchState(store, { user: { firstName: 'Jane', lastName: 'Doe' } });

      console.log(getState(store));

      expect(getState(store)).toEqual({
        ...initialState,
        user: {
          firstName: 'Jane',
          lastName: 'Doe',
        },
        fullName: 'Jane Doe',
      });
    });
  });
});
