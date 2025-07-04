import { TestBed } from '@angular/core/testing';
import { withMethods, withState } from '../src';
import { signalStore } from '../src/signal-store';
import {
  getState,
  isWritableSignal,
  patchState,
  STATE_SOURCE,
} from '../src/state-source';
import { withLinkedState } from '../src/with-linked-state';
import { withProps } from '../src/with-props';
import { linkedSignal } from '@angular/core';
import { signalStoreFeature } from '@ngrx/signals';

describe('withLinkedState', () => {
  describe('sets linkedSignal as WritableSignals of STATE_SOURCE', () => {
    [
      {
        name: 'automatic',
        linkedStateFeature: signalStoreFeature(
          withLinkedState(() => ({
            user: () => ({ id: 1, name: 'John Doe' }),
            location: () => ({ city: 'Berlin', country: 'Germany' }),
          }))
        ),
      },
      {
        name: 'manual',
        linkedStateFeature: signalStoreFeature(
          withLinkedState(() => ({
            user: linkedSignal(() => ({ id: 1, name: 'John Doe' })),
            location: linkedSignal(() => ({
              city: 'Berlin',
              country: 'Germany',
            })),
          }))
        ),
      },
    ].forEach(({ name, linkedStateFeature }) => {
      it(name, () => {
        const UserStore = signalStore(
          { providedIn: 'root', protectedState: false },
          linkedStateFeature
        );
        const userStore = TestBed.inject(UserStore);

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
        linkedStateFeature: signalStoreFeature(
          withLinkedState(() => ({
            user: () => ({ id: 1, name: 'John Doe' }),
            location: () => ({ city: 'Berlin', country: 'Germany' }),
          }))
        ),
      },
      {
        name: 'manual',
        linkedStateFeature: signalStoreFeature(
          withLinkedState(() => ({
            user: linkedSignal(() => ({ id: 1, name: 'John Doe' })),
            location: linkedSignal(() => ({
              city: 'Berlin',
              country: 'Germany',
            })),
          }))
        ),
      },
    ].forEach(({ name, linkedStateFeature }) => {
      it(name, () => {
        const UserStore = signalStore(
          { providedIn: 'root' },
          linkedStateFeature
        );

        const userStore = TestBed.inject(UserStore);

        const state = getState(userStore);
        expect(state).toEqual({
          user: { id: 1, name: 'John Doe' },
          location: { city: 'Berlin', country: 'Germany' },
        });
      });
    }));

  describe('updates automatically if the source changes', () =>
    [
      {
        name: 'automatic',
        linkedStateFeature: signalStoreFeature(
          withState({ userId: 1 }),

          withLinkedState(({ userId }) => ({
            books: () => {
              userId();

              return [] as string[];
            },
          }))
        ),
      },
      {
        name: 'manual',
        linkedStateFeature: signalStoreFeature(
          withState({ userId: 1 }),
          withLinkedState(({ userId }) => ({
            books: linkedSignal({
              source: userId,
              computation: () => [] as string[],
            }),
          }))
        ),
      },
    ].forEach(({ name, linkedStateFeature }) => {
      it(name, () => {
        const BookStore = signalStore(
          { providedIn: 'root', protectedState: false },
          linkedStateFeature,
          withState({ version: 1 }),
          withMethods((store) => ({
            updateUser() {
              patchState(store, (value) => value);
              patchState(store, ({ userId }) => ({ userId: userId + 1 }));
            },
            addBook(title: string) {
              patchState(store, ({ books }) => ({ books: [...books, title] }));
            },
            increaseVersion() {
              patchState(store, ({ version }) => ({ version: version + 1 }));
            },
          }))
        );

        const bookStore = TestBed.inject(BookStore);
        bookStore.addBook('The Neverending Story');
        bookStore.increaseVersion();
        expect(bookStore.books()).toEqual(['The Neverending Story']);
        expect(bookStore.version()).toEqual(2);

        patchState(bookStore, { userId: 2 });
        expect(bookStore.books()).toEqual([]);
        expect(bookStore.version()).toEqual(2);
      });
    }));

  describe('updates also a spread linkedSignal', () => {
    [
      {
        name: 'automatic',
        linkedStateFeature: signalStoreFeature(
          withState({ userId: 1 }),
          withLinkedState(({ userId }) => ({
            user: () => {
              userId();
              return { name: 'John Doe' };
            },
            location: () => {
              userId();
              return { city: 'Berlin', country: 'Germany' };
            },
          }))
        ),
      },
      {
        name: 'manual',
        linkedStateFeature: signalStoreFeature(
          withState({ userId: 1 }),
          withLinkedState(({ userId }) => ({
            user: linkedSignal({
              source: userId,
              computation: () => ({ name: 'John Doe' }),
            }),
            location: linkedSignal({
              source: userId,
              computation: () => ({ city: 'Berlin', country: 'Germany' }),
            }),
          }))
        ),
      },
    ].forEach(({ name, linkedStateFeature }) => {
      it(name, () => {
        const UserStore = signalStore(
          { providedIn: 'root', protectedState: false },
          linkedStateFeature,
          withMethods((store) => ({
            updateUser(name: string) {
              patchState(store, () => ({
                user: { name },
              }));
            },
            updateLocation(city: string, country: string) {
              patchState(store, () => ({
                location: { city, country },
              }));
            },
          }))
        );

        const userStore = TestBed.inject(UserStore);

        userStore.updateUser('Jane Doe');
        userStore.updateLocation('London', 'UK');

        expect(getState(userStore)).toEqual({
          userId: 1,
          user: { name: 'Jane Doe' },
          location: { city: 'London', country: 'UK' },
        });

        patchState(userStore, { userId: 2 });
        expect(getState(userStore)).toEqual({
          userId: 2,
          user: { name: 'John Doe' },
          location: { city: 'Berlin', country: 'Germany' },
        });
      });
    });
  });

  describe('can depend on another linkedState (chained)', () => {
    [
      {
        name: 'automatic',
        linkedStateFeature: signalStoreFeature(
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
        linkedStateFeature: signalStoreFeature(
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
        const NumberStore = signalStore(
          { providedIn: 'root', protectedState: false },
          linkedStateFeature
        );

        const numberStore = TestBed.inject(NumberStore);
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

  describe('can depend on a Signal from another SignalStore', () => {
    const UserStore = signalStore(
      { providedIn: 'root', protectedState: false },
      withState({ userId: 1 })
    );

    [
      {
        name: 'automatic',
        linkedStateFeature: signalStoreFeature(
          withLinkedState(() => ({
            books: () => {
              TestBed.inject(UserStore).userId();

              return [] as string[];
            },
          }))
        ),
      },
      {
        name: 'manual',
        linkedStateFeature: signalStoreFeature(
          withLinkedState(() => {
            const userStore = TestBed.inject(UserStore);

            return {
              books: linkedSignal({
                source: userStore.userId,
                computation: () => [] as string[],
              }),
            };
          })
        ),
      },
    ].forEach(({ name, linkedStateFeature }) => {
      it(name, () => {
        const BookStore = signalStore(
          { providedIn: 'root' },
          linkedStateFeature,
          withMethods((store) => ({
            addBook(title: string) {
              patchState(store, ({ books }) => ({ books: [...books, title] }));
            },
          }))
        );

        const userStore = TestBed.inject(UserStore);
        const bookStore = TestBed.inject(BookStore);

        bookStore.addBook('The Neverending Story');
        expect(bookStore.books()).toEqual(['The Neverending Story']);

        patchState(userStore, { userId: 2 });

        expect(bookStore.books()).toEqual([]);
      });
    });
  });

  describe('keeps DeepSignal updated', () => {
    [
      {
        name: 'automatic',
        linkedStateFeature: signalStoreFeature(
          withState({ userId: 1 }),
          withLinkedState(({ userId }) => ({
            user: () => ({ id: userId(), name: 'John Doe' }),
          }))
        ),
      },
      {
        name: 'manual',
        linkedStateFeature: signalStoreFeature(
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
        const UserStore = signalStore(
          { providedIn: 'root', protectedState: false },
          linkedStateFeature
        );

        const userStore = TestBed.inject(UserStore);
        const name = userStore.user.name;
        expect(name()).toEqual('John Doe');

        patchState(userStore, { user: { id: 2, name: 'Tom Smith' } });
        expect(name()).toEqual('Tom Smith');

        patchState(userStore, { userId: 2 });
        expect(name()).toEqual('John Doe');
      });
    });
  });

  describe('InnerSignalStore access', () => {
    it('can access the state signals', () => {
      const UserStore = signalStore(
        { providedIn: 'root' },
        withState({ userId: 1 }),
        withLinkedState(({ userId }) => ({ value: userId }))
      );

      const userStore = TestBed.inject(UserStore);

      expect(userStore.value()).toBe(1);
    });

    it('can access the props', () => {
      const UserStore = signalStore(
        { providedIn: 'root' },
        withProps(() => ({ userId: 1 })),
        withLinkedState(({ userId }) => ({ value: () => userId }))
      );

      const userStore = TestBed.inject(UserStore);

      expect(userStore.value()).toBe(1);
    });
  });
});
