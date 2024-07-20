import { patchState, signalStore, type } from '@ngrx/signals';
import {
  addEntities,
  entityConfig,
  removeEntities,
  withEntities,
} from '../../src';
import { Todo, todo1, todo2, todo3, User, user1, user2, user3 } from '../mocks';
import { selectTodoId } from '../helpers';

describe('removeEntities', () => {
  it('removes entities by ids', () => {
    const Store = signalStore({ protectedState: false }, withEntities<User>());
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
    const Store = signalStore({ protectedState: false }, withEntities<Todo>());
    const store = new Store();

    patchState(
      store,
      addEntities([todo1, todo2, todo3], { selectId: selectTodoId }),
      removeEntities((todo) => todo.completed)
    );

    expect(store.entityMap()).toEqual({ y: todo2 });
    expect(store.ids()).toEqual(['y']);
    expect(store.entities()).toEqual([todo2]);
  });

  it('does not modify entity state if entities do not exist', () => {
    const Store = signalStore({ protectedState: false }, withEntities<User>());
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
    const userConfig = entityConfig({
      entity: type<User>(),
      collection: 'users',
    });

    const Store = signalStore(
      { protectedState: false },
      withEntities(userConfig)
    );
    const store = new Store();

    patchState(store, addEntities([user1, user2, user3], userConfig));
    patchState(store, removeEntities([user1.id, user2.id], userConfig));

    expect(store.usersEntityMap()).toEqual({ 3: user3 });
    expect(store.usersIds()).toEqual([3]);
    expect(store.usersEntities()).toEqual([user3]);
  });

  it('removes entities by predicate from specified collection', () => {
    const userConfig = entityConfig({
      entity: type<User>(),
      collection: 'users',
    });

    const Store = signalStore(
      { protectedState: false },
      withEntities(userConfig)
    );
    const store = new Store();

    patchState(
      store,
      addEntities([user1, user2, user3], userConfig),
      removeEntities((user) => user.lastName.startsWith('J'), userConfig)
    );

    expect(store.usersEntityMap()).toEqual({ 1: user1, 2: user2 });
    expect(store.usersIds()).toEqual([1, 2]);
    expect(store.usersEntities()).toEqual([user1, user2]);
  });

  it('does not modify entity state if entities do not exist in specified collection', () => {
    const todoConfig = entityConfig({
      entity: type<Todo>(),
      collection: 'todo',
      selectId: selectTodoId,
    });

    const Store = signalStore(
      { protectedState: false },
      withEntities(todoConfig)
    );
    const store = new Store();

    patchState(store, addEntities([todo1, todo2, todo3], todoConfig));

    const todoEntityMap = store.todoEntityMap();
    const todoIds = store.todoIds();
    const todoEntities = store.todoEntities();

    patchState(
      store,
      removeEntities(['a', 'b'], todoConfig),
      removeEntities((todo) => todo.text === 'NgRx', todoConfig)
    );

    expect(store.todoEntityMap()).toBe(todoEntityMap);
    expect(store.todoIds()).toBe(todoIds);
    expect(store.todoEntities()).toBe(todoEntities);

    expect(store.todoEntityMap()).toEqual({ x: todo1, y: todo2, z: todo3 });
    expect(store.todoIds()).toEqual(['x', 'y', 'z']);
    expect(store.todoEntities()).toEqual([todo1, todo2, todo3]);
  });
});
