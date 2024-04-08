import { isSignal } from '@angular/core';
import { patchState, signalStore, type, withState } from '@ngrx/signals';
import { addEntities, removeAllEntities, withEntities } from '../src';
import { Todo, todo2, todo3, User, user1, user2 } from './mocks';

describe('withEntities', () => {
  it('adds entity feature to the store', () => {
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

  it('adds named entity feature to the store', () => {
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

  it('combines multiple entity features', () => {
    const todoMeta = {
      entity: type<Todo>(),
      collection: 'todo',
      idKey: '_id',
    } as const;

    const Store = signalStore(withEntities<User>(), withEntities(todoMeta));
    const store = new Store();

    expect(isSignal(store.entityMap)).toBe(true);
    expect(store.entityMap()).toEqual({});
    expect(isSignal(store.todoEntityMap)).toBe(true);
    expect(store.todoEntityMap()).toEqual({});

    expect(isSignal(store.ids)).toBe(true);
    expect(store.ids()).toEqual([]);
    expect(isSignal(store.todoIds)).toBe(true);
    expect(store.todoIds()).toEqual([]);

    expect(isSignal(store.entities)).toBe(true);
    expect(store.entities()).toEqual([]);
    expect(isSignal(store.todoEntities)).toBe(true);
    expect(store.todoEntities()).toEqual([]);

    patchState(
      store,
      addEntities([user2, user1]),
      addEntities([todo2, todo3], todoMeta)
    );

    expect(store.entityMap()).toEqual({ 2: user2, 1: user1 });
    expect(store.ids()).toEqual([2, 1]);
    expect(store.entities()).toEqual([user2, user1]);
    expect(store.todoEntityMap()).toEqual({ y: todo2, z: todo3 });
    expect(store.todoIds()).toEqual(['y', 'z']);
    expect(store.todoEntities()).toEqual([todo2, todo3]);
  });

  it('combines entity feature with regular state', () => {
    const Store = signalStore(
      withState({ loading: false }),
      withEntities<User>()
    );
    const store = new Store();

    expect(store.loading).toBe(false);

    patchState(store, removeAllEntities(), { loading: true });

    expect(store.entityMap()).toEqual({});
    expect(store.loading).toBe(true);
  });
});
