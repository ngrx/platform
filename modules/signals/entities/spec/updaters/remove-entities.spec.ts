import { patchState, signalStore, type } from '@ngrx/signals';
import { addEntities, removeEntities, withEntities } from '../../src';
import { Todo, todo1, todo2, todo3, User, user1, user2, user3 } from '../mocks';

describe('removeEntities', () => {
  it('removes entities by ids', () => {
    const Store = signalStore(withEntities<User>());
    const store = new Store();

    patchState(
      store,
      addEntities([user1, user2, user3]),
      removeEntities([user1.id, user3.id])
    );

    expect(store.entityMap()).toEqual({ 2: user2 });
    expect(store.ids()).toEqual([2]);
    expect(store.entities()).toEqual([user2]);
  });

  it('removes entities by predicate', () => {
    const Store = signalStore(withEntities<Todo>());
    const store = new Store();

    patchState(
      store,
      addEntities([todo1, todo2, todo3], { idKey: '_id' }),
      removeEntities((todo) => todo.completed)
    );

    expect(store.entityMap()).toEqual({ y: todo2 });
    expect(store.ids()).toEqual(['y']);
    expect(store.entities()).toEqual([todo2]);
  });

  it('does not modify entity state if entities do not exist', () => {
    const Store = signalStore(withEntities<User>());
    const store = new Store();

    patchState(store, addEntities([user1, user2, user3]));

    const entityMap = store.entityMap();
    const ids = store.ids();
    const entities = store.entities();

    patchState(
      store,
      removeEntities([20, 30]),
      removeEntities((user) => user.id > 100)
    );

    expect(store.entityMap()).toBe(entityMap);
    expect(store.ids()).toBe(ids);
    expect(store.entities()).toBe(entities);

    expect(store.entityMap()).toEqual({ 1: user1, 2: user2, 3: user3 });
    expect(store.ids()).toEqual([1, 2, 3]);
    expect(store.entities()).toEqual([user1, user2, user3]);
  });

  it('removes entities by ids from specified collection', () => {
    const userMeta = {
      entity: type<User>(),
      collection: 'users',
    } as const;

    const Store = signalStore(withEntities(userMeta));
    const store = new Store();

    patchState(store, addEntities([user1, user2, user3], userMeta));
    patchState(store, removeEntities([user1.id, user2.id], userMeta));

    expect(store.usersEntityMap()).toEqual({ 3: user3 });
    expect(store.usersIds()).toEqual([3]);
    expect(store.usersEntities()).toEqual([user3]);
  });

  it('removes entities by predicate from specified collection', () => {
    const userMeta = {
      entity: type<User>(),
      collection: 'users',
    } as const;

    const Store = signalStore(withEntities(userMeta));
    const store = new Store();

    patchState(
      store,
      addEntities([user1, user2, user3], userMeta),
      removeEntities((user) => user.lastName.startsWith('J'), userMeta)
    );

    expect(store.usersEntityMap()).toEqual({ 1: user1, 2: user2 });
    expect(store.usersIds()).toEqual([1, 2]);
    expect(store.usersEntities()).toEqual([user1, user2]);
  });

  it('does not modify entity state if entities do not exist in specified collection', () => {
    const todoMeta = {
      entity: type<Todo>(),
      collection: 'todo',
      idKey: '_id',
    } as const;

    const Store = signalStore(withEntities(todoMeta));
    const store = new Store();

    patchState(store, addEntities([todo1, todo2, todo3], todoMeta));

    const todoEntityMap = store.todoEntityMap();
    const todoIds = store.todoIds();
    const todoEntities = store.todoEntities();

    patchState(
      store,
      removeEntities(['a', 'b'], todoMeta),
      removeEntities((todo) => todo.text === 'NgRx', todoMeta)
    );

    expect(store.todoEntityMap()).toBe(todoEntityMap);
    expect(store.todoIds()).toBe(todoIds);
    expect(store.todoEntities()).toBe(todoEntities);

    expect(store.todoEntityMap()).toEqual({ x: todo1, y: todo2, z: todo3 });
    expect(store.todoIds()).toEqual(['x', 'y', 'z']);
    expect(store.todoEntities()).toEqual([todo1, todo2, todo3]);
  });
});
