import { linkedSignal, signal } from '@angular/core';
import {
  getState,
  patchState,
  signalStoreFeature,
  withLinkedState,
  withState,
} from '../src';
import { getInitialInnerStore } from '../src/signal-store';
import { isWritableSignal, STATE_SOURCE } from '../src/state-source';

describe('withLinkedState', () => {
  describe('adds linked state slices to the STATE_SOURCE', () => {
    [
      {
        name: 'with computation function',
        linkedStateFeature: () =>
          withLinkedState(() => ({
            user: () => ({ id: 1, name: 'John Doe' }),
            location: () => ({ city: 'Berlin', country: 'Germany' }),
          })),
      },
      {
        name: 'with explicit linkedSignal',
        linkedStateFeature: () =>
          withLinkedState(() => ({
            user: linkedSignal(() => ({ id: 1, name: 'John Doe' })),
            location: linkedSignal(() => ({
              city: 'Berlin',
              country: 'Germany',
            })),
          })),
      },
      {
        name: 'with user-defined WritableSignal',
        linkedStateFeature: () =>
          withLinkedState(() => ({
            user: signal(() => ({ id: 1, name: 'John Doe' })),
            location: signal(() => ({
              city: 'Berlin',
              country: 'Germany',
            })),
          })),
      },
    ].forEach(({ name, linkedStateFeature }) => {
      it(name, () => {
        const initialStore = getInitialInnerStore();
        const userStore = linkedStateFeature()(initialStore);

        const stateSource = userStore[STATE_SOURCE];

        expect(isWritableSignal(stateSource.location)).toBe(true);
        expect(isWritableSignal(stateSource.user)).toBe(true);
      });
    });
  });

  describe('spreads properties of the linked state slice to the state', () =>
    [
      {
        name: 'with computation function',
        linkedStateFeature: () =>
          withLinkedState(() => ({
            user: () => ({ id: 1, name: 'John Doe' }),
            location: () => ({ city: 'Berlin', country: 'Germany' }),
          })),
      },
      {
        name: 'with explicit linkedSignal',
        linkedStateFeature: () =>
          withLinkedState(() => ({
            user: linkedSignal(() => ({ id: 1, name: 'John Doe' })),
            location: linkedSignal(() => ({
              city: 'Berlin',
              country: 'Germany',
            })),
          })),
      },
      {
        name: 'with user-defined WritableSignal',
        linkedStateFeature: () =>
          withLinkedState(() => ({
            user: signal({ id: 1, name: 'John Doe' }),
            location: signal({
              city: 'Berlin',
              country: 'Germany',
            }),
          })),
      },
    ].forEach(({ name, linkedStateFeature }) => {
      it(name, () => {
        const initialStore = getInitialInnerStore();
        const userStore = linkedStateFeature()(initialStore);

        const state = getState(userStore);
        expect(state).toEqual({
          user: { id: 1, name: 'John Doe' },
          location: { city: 'Berlin', country: 'Germany' },
        });
      });
    }));

  describe('can depend on another withLinkedState', () => {
    [
      {
        name: 'with computation function',
        linkedStateFeature: () =>
          signalStoreFeature(
            withState({ id: 1 }),
            withLinkedState(({ id }) => ({
              level1: () => id() * 2,
            })),
            withLinkedState(({ level1 }) => ({
              level2: () => level1() * 10,
            }))
          ),
      },
      {
        name: 'with explicit linkedSignal',
        linkedStateFeature: () =>
          signalStoreFeature(
            withState({ id: 1 }),
            withLinkedState(({ id }) => ({
              level1: linkedSignal({
                source: id,
                computation: () => id() * 2,
              }),
            })),
            withLinkedState(({ level1 }) => ({
              level2: linkedSignal({
                source: level1,
                computation: () => level1() * 10,
              }),
            }))
          ),
      },
      {
        name: 'with user-defined WritableSignal',
        linkedStateFeature: () =>
          signalStoreFeature(
            withLinkedState(() => ({ id: signal(1) })),
            withLinkedState(({ id }) => ({
              level1: linkedSignal({
                source: id,
                computation: () => id() * 2,
              }),
            })),
            withLinkedState(({ level1 }) => ({
              level2: linkedSignal({
                source: level1,
                computation: () => level1() * 10,
              }),
            }))
          ),
      },
    ].forEach(({ name, linkedStateFeature }) => {
      it(name, () => {
        const initialStore = getInitialInnerStore();
        const numberStore = linkedStateFeature()(initialStore);

        expect(getState(numberStore)).toEqual({ id: 1, level1: 2, level2: 20 });

        patchState(numberStore, { id: 2 });
        expect(getState(numberStore)).toEqual({ id: 2, level1: 4, level2: 40 });

        patchState(numberStore, { level1: 5 });
        expect(getState(numberStore)).toEqual({ id: 2, level1: 5, level2: 50 });

        patchState(numberStore, { level2: 100 });
        expect(getState(numberStore)).toEqual({
          id: 2,
          level1: 5,
          level2: 100,
        });

        patchState(numberStore, { id: 3 });
        expect(getState(numberStore)).toEqual({ id: 3, level1: 6, level2: 60 });
      });
    });
  });

  describe('keeps DeepSignal updated', () => {
    [
      {
        name: 'with computation function',
        linkedStateFeature: () =>
          signalStoreFeature(
            withState({ userId: 1 }),
            withLinkedState(({ userId }) => ({
              user: () => ({ id: userId(), name: 'John Doe' }),
            }))
          ),
      },
      {
        name: 'with explicit linkedSignal',
        linkedStateFeature: () =>
          signalStoreFeature(
            withState({ userId: 1 }),
            withLinkedState(({ userId }) => ({
              user: linkedSignal({
                source: userId,
                computation: (id) => ({ id, name: 'John Doe' }),
              }),
            }))
          ),
      },
    ].forEach(({ name, linkedStateFeature }) => {
      it(name, () => {
        const initialStore = getInitialInnerStore();
        const userStore = linkedStateFeature()(initialStore);

        const name = userStore.stateSignals.user.name;
        expect(name()).toBe('John Doe');

        patchState(userStore, { user: { id: 2, name: 'Tom Smith' } });
        expect(name()).toBe('Tom Smith');

        patchState(userStore, { userId: 2 });
        expect(name()).toBe('John Doe');
      });
    });

    it('with user-defined WritableSignal', () => {
      const initialStore = getInitialInnerStore();
      const user = signal({ name: 'John' });
      const userStore = withLinkedState(() => ({ user }))(initialStore);

      const name = userStore.stateSignals.user.name;
      expect(name()).toBe('John');

      patchState(userStore, { user: { name: 'Tom' } });
      expect(name()).toBe('Tom');

      user.set({ name: 'Mark' });
      expect(name()).toBe('Mark');
    });
  });
});
