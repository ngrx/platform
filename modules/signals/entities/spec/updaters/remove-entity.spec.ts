import { patchState, signalStore, type } from '@ngrx/signals';
import {
  addEntities,
  entityConfig,
  removeEntity,
  withEntities,
} from '../../src';
import { Todo, todo1, todo2, todo3, User, user1, user2 } from '../mocks';
import { selectTodoId } from '../helpers';

describe('removeEntity', () => {
  it('removes entity', () => {
    const Store = signalStore({ protectedState: false }, withEntities<User>());
    const store = new Store();

    patchState(store, addEntities([user1, user2]), removeEntity(user1.id));

    expect(store.entityMap()).toEqual({ 2: user2 });
    expect(store.ids()).toEqual([2]);
    expect(store.entities()).toEqual([user2]);
  });

  it('does not modify entity state if entity does not exist', () => {
    const Store = signalStore({ protectedState: false }, withEntities<Todo>());
    const store = new Store();

    patchState(store, addEntities([todo2, todo3], { selectId: selectTodoId }));

    const entityMap = store.entityMap();
    const ids = store.ids();
    const entities = store.entities();

    patchState(store, removeEntity(todo1._id));

    expect(store.entityMap()).toBe(entityMap);
    expect(store.ids()).toBe(ids);
    expect(store.entities()).toBe(entities);

    expect(store.entityMap()).toEqual({ y: todo2, z: todo3 });
    expect(store.ids()).toEqual(['y', 'z']);
    expect(store.entities()).toEqual([todo2, todo3]);
  });

  it('removes entity from specified collection', () => {
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

    patchState(
      store,
      addEntities([todo1, todo2, todo3], todoConfig),
      removeEntity(todo1._id, todoConfig)
    );

    expect(store.todoEntityMap()).toEqual({ y: todo2, z: todo3 });
    expect(store.todoIds()).toEqual(['y', 'z']);
    expect(store.todoEntities()).toEqual([todo2, todo3]);

    patchState(store, removeEntity(todo2._id, todoConfig));

    expect(store.todoEntityMap()).toEqual({ z: todo3 });
    expect(store.todoIds()).toEqual(['z']);
    expect(store.todoEntities()).toEqual([todo3]);
  });

  it('does not modify entity state if entity does not exist in specified collection', () => {
    const Store = signalStore(
      { protectedState: false },
      withEntities({
        entity: type<User>(),
        collection: 'user',
      })
    );
    const store = new Store();

    patchState(store, addEntities([user1, user2], { collection: 'user' }));

    const userEntityMap = store.userEntityMap();
    const userIds = store.userIds();
    const userEntities = store.userEntities();

    patchState(
      store,
      removeEntity(200, { collection: 'user' }),
      removeEntity(300, { collection: 'user' })
    );

    expect(store.userEntityMap()).toBe(userEntityMap);
    expect(store.userIds()).toBe(userIds);
    expect(store.userEntities()).toBe(userEntities);

    expect(store.userEntityMap()).toEqual({ 1: user1, 2: user2 });
    expect(store.userIds()).toEqual([1, 2]);
    expect(store.userEntities()).toEqual([user1, user2]);
  });
});
