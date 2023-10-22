import { patchState, signalStore, type } from '@ngrx/signals';
import { setAllEntities, withEntities } from '../../src';
import { Todo, todo1, todo2, todo3, User, user1, user2, user3 } from '../mocks';

describe('setAllEntities', () => {
  it('replaces entity collection with provided entities', () => {
    const Store = signalStore(withEntities<User>());
    const store = new Store();

    patchState(store, setAllEntities([user1, user2]));

    expect(store.entityMap()).toEqual({ 1: user1, 2: user2 });
    expect(store.ids()).toEqual([1, 2]);
    expect(store.entities()).toEqual([user1, user2]);

    patchState(store, setAllEntities([user3, user2, user1]));

    expect(store.entityMap()).toEqual({ 3: user3, 2: user2, 1: user1 });
    expect(store.ids()).toEqual([3, 2, 1]);
    expect(store.entities()).toEqual([user3, user2, user1]);

    patchState(store, setAllEntities([] as User[]));

    expect(store.entityMap()).toEqual({});
    expect(store.ids()).toEqual([]);
    expect(store.entities()).toEqual([]);
  });

  it('replaces specified entity collection with provided entities', () => {
    const Store = signalStore(
      withEntities({
        entity: type<User>(),
        collection: 'user',
      })
    );
    const store = new Store();

    patchState(store, setAllEntities([user1, user2], { collection: 'user' }));

    expect(store.userEntityMap()).toEqual({ 1: user1, 2: user2 });
    expect(store.userIds()).toEqual([1, 2]);
    expect(store.userEntities()).toEqual([user1, user2]);

    patchState(
      store,
      setAllEntities([user3, user2, user1], { collection: 'user' })
    );

    expect(store.userEntityMap()).toEqual({ 3: user3, 2: user2, 1: user1 });
    expect(store.userIds()).toEqual([3, 2, 1]);
    expect(store.userEntities()).toEqual([user3, user2, user1]);

    patchState(store, setAllEntities([] as User[], { collection: 'user' }));

    expect(store.userEntityMap()).toEqual({});
    expect(store.userIds()).toEqual([]);
    expect(store.userEntities()).toEqual([]);
  });

  it('replaces entity collection with provided entities with the specified idKey', () => {
    const Store = signalStore(withEntities<Todo>());
    const store = new Store();

    patchState(store, setAllEntities([todo2, todo3], { idKey: '_id' }));

    expect(store.entityMap()).toEqual({ y: todo2, z: todo3 });
    expect(store.ids()).toEqual(['y', 'z']);
    expect(store.entities()).toEqual([todo2, todo3]);

    patchState(store, setAllEntities([todo3, todo2, todo1], { idKey: '_id' }));

    expect(store.entityMap()).toEqual({ z: todo3, y: todo2, x: todo1 });
    expect(store.ids()).toEqual(['z', 'y', 'x']);
    expect(store.entities()).toEqual([todo3, todo2, todo1]);

    patchState(store, setAllEntities([] as Todo[], { idKey: '_id' }));

    expect(store.entityMap()).toEqual({});
    expect(store.ids()).toEqual([]);
    expect(store.entities()).toEqual([]);
  });

  it('replaces specified entity collection with provided entities with the specified idKey', () => {
    const todoMeta = {
      entity: type<Todo>(),
      collection: 'todo',
      idKey: '_id',
    } as const;

    const Store = signalStore(withEntities(todoMeta));
    const store = new Store();

    patchState(store, setAllEntities([todo1, todo3], todoMeta));

    expect(store.todoEntityMap()).toEqual({ x: todo1, z: todo3 });
    expect(store.todoIds()).toEqual(['x', 'z']);
    expect(store.todoEntities()).toEqual([todo1, todo3]);

    patchState(store, setAllEntities([todo3, todo2, todo1], todoMeta));

    expect(store.todoEntityMap()).toEqual({ z: todo3, y: todo2, x: todo1 });
    expect(store.todoIds()).toEqual(['z', 'y', 'x']);
    expect(store.todoEntities()).toEqual([todo3, todo2, todo1]);

    patchState(store, setAllEntities([] as Todo[], todoMeta));

    expect(store.todoEntityMap()).toEqual({});
    expect(store.todoIds()).toEqual([]);
    expect(store.todoEntities()).toEqual([]);
  });
});
