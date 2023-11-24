import * as angular from '@angular/core';
import { effect, isSignal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { patchState, signalState } from '../src';
import { STATE_SIGNAL } from '../src/state-signal';

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

  it('overrides Function properties if state keys have the same name', () => {
    const initialState = { name: { length: { length: 'ngrx' }, name: 20 } };
    const state = signalState(initialState);

    expect(state()).toBe(initialState);

    expect(state.name()).toBe(initialState.name);
    expect(isSignal(state.name)).toBe(true);

    expect(state.name.name()).toBe(20);
    expect(isSignal(state.name.name)).toBe(true);

    expect(state.name.length()).toBe(initialState.name.length);
    expect(isSignal(state.name.length)).toBe(true);

    expect(state.name.length.length()).toBe('ngrx');
    expect(isSignal(state.name.length.length)).toBe(true);
  });

  it('emits new values only for affected signals', () => {
    TestBed.runInInjectionContext(() => {
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

      TestBed.flushEffects();

      expect(numbersEmitted).toBe(1);
      expect(userEmitted).toBe(1);
      expect(firstNameEmitted).toBe(1);

      patchState(state, { numbers: [1, 2, 3] });
      TestBed.flushEffects();

      expect(numbersEmitted).toBe(2);
      expect(userEmitted).toBe(1);
      expect(firstNameEmitted).toBe(1);

      patchState(state, (state) => ({
        user: { ...state.user, lastName: 'Schmidt' },
      }));
      TestBed.flushEffects();

      expect(numbersEmitted).toBe(2);
      expect(userEmitted).toBe(2);
      expect(firstNameEmitted).toBe(1);

      patchState(state, (state) => ({
        user: { ...state.user, firstName: 'Johannes' },
      }));
      TestBed.flushEffects();

      expect(numbersEmitted).toBe(2);
      expect(userEmitted).toBe(3);
      expect(firstNameEmitted).toBe(2);
    });
  });

  it('does not emit if there was no change', () =>
    TestBed.runInInjectionContext(() => {
      let stateCounter = 0;
      let userCounter = 0;
      const state = signalState(initialState);
      const user = state.user;

      effect(() => {
        state();
        stateCounter++;
      });

      effect(() => {
        user();
        userCounter++;
      });

      TestBed.flushEffects();
      expect(stateCounter).toBe(1);
      expect(userCounter).toBe(1);

      patchState(state, {});
      TestBed.flushEffects();
      expect(stateCounter).toBe(2);
      expect(userCounter).toBe(1);

      patchState(state, (state) => state);
      TestBed.flushEffects();
      expect(stateCounter).toBe(3);
      expect(userCounter).toBe(1);
    }));
});
