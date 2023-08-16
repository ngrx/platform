import { effect } from '@angular/core';
import { signalState } from '../src';
import { testEffects } from './helpers';

describe('signalState', () => {
  const initialState = {
    user: {
      firstName: 'John',
      lastName: 'Smith',
    },
    foo: 'bar',
    numbers: [1, 2, 3],
    ngrx: 'signals',
  };

  describe('$update', () => {
    it('updates state via partial state object', () => {
      const state = signalState(initialState);

      state.$update({
        user: { firstName: 'Johannes', lastName: 'Schmidt' },
        foo: 'baz',
      });

      expect(state()).toEqual({
        ...initialState,
        user: { firstName: 'Johannes', lastName: 'Schmidt' },
        foo: 'baz',
      });
    });

    it('updates state via updater function', () => {
      const state = signalState(initialState);

      state.$update((state) => ({
        numbers: [...state.numbers, 4],
        ngrx: 'rocks',
      }));

      expect(state()).toEqual({
        ...initialState,
        numbers: [1, 2, 3, 4],
        ngrx: 'rocks',
      });
    });

    it('updates state via sequence of partial state objects and updater functions', () => {
      const state = signalState(initialState);

      state.$update(
        { user: { firstName: 'Johannes', lastName: 'Schmidt' } },
        (state) => ({ numbers: [...state.numbers, 4], foo: 'baz' }),
        (state) => ({ user: { ...state.user, firstName: 'Jovan' } }),
        { foo: 'foo' }
      );

      expect(state()).toEqual({
        ...initialState,
        user: { firstName: 'Jovan', lastName: 'Schmidt' },
        foo: 'foo',
        numbers: [1, 2, 3, 4],
      });
    });

    it('updates state immutably', () => {
      const state = signalState(initialState);

      state.$update({
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

  describe('nested signals', () => {
    it('creates signals for nested state slices', () => {
      const state = signalState(initialState);

      expect(state()).toBe(initialState);
      expect(state.user()).toBe(initialState.user);
      expect(state.user.firstName()).toBe(initialState.user.firstName);
      expect(state.foo()).toBe(initialState.foo);
      expect(state.numbers()).toBe(initialState.numbers);
      expect(state.ngrx()).toBe(initialState.ngrx);
    });

    it('does not modify props that are not state slices', () => {
      const state = signalState(initialState);
      (state as any).x = 1;
      (state.user as any).x = 2;
      (state.user.firstName as any).x = 3;

      expect((state as any).x).toBe(1);
      expect((state.user as any).x).toBe(2);
      expect((state.user.firstName as any).x).toBe(3);

      expect((state as any).y).toBe(undefined);
      expect((state.user as any).y).toBe(undefined);
      expect((state.user.firstName as any).y).toBe(undefined);
    });

    it(
      'emits new values only for affected signals',
      testEffects((tick) => {
        const state = signalState(initialState);
        let numbersEmitted = 0;
        let userEmitted = 0;
        let firstNameEmitted = 0;

        effect(() => {
          state.numbers();
          numbersEmitted++;
        });

        effect(() => {
          state.user();
          userEmitted++;
        });

        effect(() => {
          state.user.firstName();
          firstNameEmitted++;
        });

        expect(numbersEmitted).toBe(0);
        expect(userEmitted).toBe(0);
        expect(firstNameEmitted).toBe(0);

        tick();

        expect(numbersEmitted).toBe(1);
        expect(userEmitted).toBe(1);
        expect(firstNameEmitted).toBe(1);

        state.$update({ numbers: [1, 2, 3] });
        tick();

        expect(numbersEmitted).toBe(2);
        expect(userEmitted).toBe(1);
        expect(firstNameEmitted).toBe(1);

        state.$update((state) => ({
          user: { ...state.user, lastName: 'Schmidt' },
        }));
        tick();

        expect(numbersEmitted).toBe(2);
        expect(userEmitted).toBe(2);
        expect(firstNameEmitted).toBe(1);

        state.$update((state) => ({
          user: { ...state.user, firstName: 'Johannes' },
        }));
        tick();

        expect(numbersEmitted).toBe(2);
        expect(userEmitted).toBe(3);
        expect(firstNameEmitted).toBe(2);
      })
    );
  });
});
