import { linkedSignal } from '@angular/core';
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
  describe('sets linkedSignal as WritableSignals of STATE_SOURCE', () => {
    [
      {
        name: 'automatic',
        linkedStateFeature: () =>
          withLinkedState(() => ({
            user: () => ({ id: 1, name: 'John Doe' }),
            location: () => ({ city: 'Berlin', country: 'Germany' }),
          })),
      },
      {
        name: 'manual',
        linkedStateFeature: () =>
          withLinkedState(() => ({
            user: linkedSignal(() => ({ id: 1, name: 'John Doe' })),
            location: linkedSignal(() => ({
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

  describe('spreads the linkedSignal properties to the state', () =>
    [
      {
        name: 'automatic',
        linkedStateFeature: () =>
          withLinkedState(() => ({
            user: () => ({ id: 1, name: 'John Doe' }),
            location: () => ({ city: 'Berlin', country: 'Germany' }),
          })),
      },
      {
        name: 'manual',
        linkedStateFeature: () =>
          withLinkedState(() => ({
            user: linkedSignal(() => ({ id: 1, name: 'John Doe' })),
            location: linkedSignal(() => ({
              city: 'Berlin',
              country: 'Germany',
            })),
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

  describe('can depend on another linkedState (chained)', () => {
    [
      {
        name: 'automatic',
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
        name: 'manual',
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
        name: 'automatic',
        linkedStateFeature: () =>
          signalStoreFeature(
            withState({ userId: 1 }),
            withLinkedState(({ userId }) => ({
              user: () => ({ id: userId(), name: 'John Doe' }),
            }))
          ),
      },
      {
        name: 'manual',
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
        expect(name()).toEqual('John Doe');

        patchState(userStore, { user: { id: 2, name: 'Tom Smith' } });
        expect(name()).toEqual('Tom Smith');

        patchState(userStore, { userId: 2 });
        expect(name()).toEqual('John Doe');
      });
    });
  });
});
