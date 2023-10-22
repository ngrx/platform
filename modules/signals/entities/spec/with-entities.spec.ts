import { isSignal } from '@angular/core';
import { patchState, signalStore, type } from '@ngrx/signals';
import { addEntities, withEntities } from '../src';

describe('withEntities', () => {
  type User = { id: number; firstName: string; lastName: string };

  const user1: User = { id: 1, firstName: 'John', lastName: 'Doe' };
  const user2: User = { id: 2, firstName: 'Jane', lastName: 'Smith' };

  it('adds entity state and computed signals to the store', () => {
    const Store = signalStore(withEntities<User>());
    const store = new Store();

    expect(isSignal(store.entityMap)).toBe(true);
    expect(store.entityMap()).toEqual({});

    expect(isSignal(store.ids)).toBe(true);
    expect(store.ids()).toEqual([]);

    expect(isSignal(store.entities)).toBe(true);
    expect(store.entities()).toEqual([]);

    patchState(store, addEntities([user1, user2]));

    expect(store.entityMap()).toEqual({ 1: user1, 2: user2 });
    expect(store.ids()).toEqual([1, 2]);
    expect(store.entities()).toEqual([user1, user2]);
  });

  it('adds named entity state and computed signals to the store', () => {
    const Store = signalStore(
      withEntities({ entity: type<User>(), collection: 'user' })
    );
    const store = new Store();

    expect(isSignal(store.userEntityMap)).toBe(true);
    expect(store.userEntityMap()).toEqual({});

    expect(isSignal(store.userIds)).toBe(true);
    expect(store.userIds()).toEqual([]);

    expect(isSignal(store.userEntities)).toBe(true);
    expect(store.userEntities()).toEqual([]);

    patchState(store, addEntities([user2, user1], { collection: 'user' }));

    expect(store.userEntityMap()).toEqual({ 2: user2, 1: user1 });
    expect(store.userIds()).toEqual([2, 1]);
    expect(store.userEntities()).toEqual([user2, user1]);
  });
});
