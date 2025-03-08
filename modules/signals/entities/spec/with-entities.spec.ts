import { isSignal } from '@angular/core';
import { patchState, signalStore, type, withMethods } from '@ngrx/signals';
import { addEntities, entityConfig, withEntities } from '../src';
import { Todo, todo2, todo3, User, user1, user2 } from './mocks';
import { selectTodoId } from './helpers';

describe('withEntities', () => {
  describe('signle entity feature', () => {
    it('adds entity feature to the store', () => {
      const Store = signalStore(
        withEntities<User>(),
        withMethods((store) => ({
          addUsers(): void {
            patchState(store, addEntities([user1, user2]));
          },
        }))
      );
      const store = new Store();

      expect(isSignal(store.entityMap)).toBe(true);
      expect(store.entityMap()).toEqual({});

      expect(isSignal(store.ids)).toBe(true);
      expect(store.ids()).toEqual([]);

      expect(isSignal(store.entities)).toBe(true);
      expect(store.entities()).toEqual([]);

      expect(isSignal(store.selectedId)).toBe(true);
      expect(store.selectedId()).toEqual(null);

      expect(isSignal(store.selectedEntity)).toBe(true);
      expect(store.selectedEntity()).toEqual(null);

      store.addUsers();

      expect(store.entityMap()).toEqual({ 1: user1, 2: user2 });
      expect(store.ids()).toEqual([1, 2]);
      expect(store.entities()).toEqual([user1, user2]);
      expect(store.selectedId()).toEqual(null);
      expect(store.selectedEntity()).toEqual(null);
    });
  });

  it('adds named entity feature to the store', () => {
    const Store = signalStore(
      withEntities({ entity: type<User>(), collection: 'user' }),
      withMethods((store) => ({
        addUsers(): void {
          patchState(
            store,
            addEntities([user2, user1], { collection: 'user' })
          );
        },
      }))
    );
    const store = new Store();

    expect(isSignal(store.userEntityMap)).toBe(true);
    expect(store.userEntityMap()).toEqual({});

    expect(isSignal(store.userIds)).toBe(true);
    expect(store.userIds()).toEqual([]);

    expect(isSignal(store.userEntities)).toBe(true);
    expect(store.userEntities()).toEqual([]);

    expect(isSignal(store.userSelectedId)).toBe(true);
    expect(store.userSelectedId()).toEqual(null);

    expect(isSignal(store.userSelectedEntity)).toBe(true);
    expect(store.userSelectedEntity()).toEqual(null);

    store.addUsers();

    expect(store.userEntityMap()).toEqual({ 2: user2, 1: user1 });
    expect(store.userIds()).toEqual([2, 1]);
    expect(store.userEntities()).toEqual([user2, user1]);
    expect(store.userSelectedId()).toEqual(null);
    expect(store.userSelectedEntity()).toEqual(null);
  });

  it('combines multiple entity features', () => {
    const todoConfig = entityConfig({
      entity: type<Todo>(),
      collection: 'todo',
      selectId: selectTodoId,
    });

    const Store = signalStore(
      withEntities<User>(),
      withEntities(todoConfig),
      withMethods((store) => ({
        addEntities(): void {
          patchState(
            store,
            addEntities([user2, user1]),
            addEntities([todo2, todo3], todoConfig)
          );
        },
      }))
    );
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

    expect(isSignal(store.selectedId)).toBe(true);
    expect(store.selectedId()).toEqual(null);
    expect(isSignal(store.todoSelectedId)).toBe(true);
    expect(store.todoSelectedId()).toEqual(null);

    expect(isSignal(store.selectedEntity)).toBe(true);
    expect(store.selectedEntity()).toEqual(null);
    expect(isSignal(store.todoSelectedEntity)).toBe(true);
    expect(store.todoSelectedEntity()).toEqual(null);

    store.addEntities();

    expect(store.entityMap()).toEqual({ 2: user2, 1: user1 });
    expect(store.ids()).toEqual([2, 1]);
    expect(store.entities()).toEqual([user2, user1]);
    expect(store.selectedId()).toEqual(null);
    expect(store.selectedEntity()).toEqual(null);

    expect(store.todoEntityMap()).toEqual({ y: todo2, z: todo3 });
    expect(store.todoIds()).toEqual(['y', 'z']);
    expect(store.todoEntities()).toEqual([todo2, todo3]);
    expect(store.todoSelectedId()).toEqual(null);
    expect(store.todoSelectedEntity()).toEqual(null);
  });
});
