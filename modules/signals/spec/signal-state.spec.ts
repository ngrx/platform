import { effect, isSignal } from '@angular/core';
import * as angular from '@angular/core';
import { patchState, signalState } from '../src';
import { STATE_SIGNAL } from '../src/signal-state';
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

  it('has state signal', () => {
    const state = signalState({});
    const stateSignal = state[STATE_SIGNAL];

    expect(isSignal(stateSignal)).toBe(true);
    expect(typeof stateSignal.update === 'function').toBe(true);
  });

  it('creates signals for nested state slices', () => {
    const state = signalState(initialState);

    expect(state()).toBe(initialState);
    expect(isSignal(state)).toBe(true);

    expect(state.user()).toBe(initialState.user);
    expect(isSignal(state.user)).toBe(true);

    expect(state.user.firstName()).toBe(initialState.user.firstName);
    expect(isSignal(state.user.firstName)).toBe(true);

    expect(state.foo()).toBe(initialState.foo);
    expect(isSignal(state.foo)).toBe(true);

    expect(state.numbers()).toBe(initialState.numbers);
    expect(isSignal(state.numbers)).toBe(true);

    expect(state.ngrx()).toBe(initialState.ngrx);
    expect(isSignal(state.ngrx)).toBe(true);
  });

  it('caches previously created signals', () => {
    jest.spyOn(angular, 'computed');

    const state = signalState(initialState);
    const user1 = state.user;
    const user2 = state.user;

    expect(angular.computed).toHaveBeenCalledTimes(1);

    const _ = state.user.firstName;
    const __ = user1.firstName;
    const ___ = user2.firstName;

    expect(angular.computed).toHaveBeenCalledTimes(2);
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

  it('does not modify STATE_SIGNAL', () => {
    const state = signalState(initialState);

    expect((state[STATE_SIGNAL] as any).user).toBe(undefined);
    expect((state[STATE_SIGNAL] as any).foo).toBe(undefined);
    expect((state[STATE_SIGNAL] as any).numbers).toBe(undefined);
    expect((state[STATE_SIGNAL] as any).ngrx).toBe(undefined);
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

      patchState(state, { numbers: [1, 2, 3] });
      tick();

      expect(numbersEmitted).toBe(2);
      expect(userEmitted).toBe(1);
      expect(firstNameEmitted).toBe(1);

      patchState(state, (state) => ({
        user: { ...state.user, lastName: 'Schmidt' },
      }));
      tick();

      expect(numbersEmitted).toBe(2);
      expect(userEmitted).toBe(2);
      expect(firstNameEmitted).toBe(1);

      patchState(state, (state) => ({
        user: { ...state.user, firstName: 'Johannes' },
      }));
      tick();

      expect(numbersEmitted).toBe(2);
      expect(userEmitted).toBe(3);
      expect(firstNameEmitted).toBe(2);
    })
  );
});
