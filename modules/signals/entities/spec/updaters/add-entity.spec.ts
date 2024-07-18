import { patchState, signalStore, type } from '@ngrx/signals';
import { addEntity, entityConfig, withEntities } from '../../src';
import { Todo, todo1, todo2, User, user1, user2 } from '../mocks';
import { selectTodoId as selectId } from '../helpers';

describe('addEntity', () => {
  it('adds entity if it does not exist', () => {
    const Store = signalStore({ protectedState: false }, withEntities<User>());
    const store = new Store();

    patchState(store, addEntity(user1));

    expect(store.entityMap()).toEqual({ 1: user1 });
    expect(store.ids()).toEqual([1]);
    expect(store.entities()).toEqual([user1]);

    patchState(store, addEntity(user2));

    expect(store.entityMap()).toEqual({ 1: user1, 2: user2 });
    expect(store.ids()).toEqual([1, 2]);
    expect(store.entities()).toEqual([user1, user2]);
  });

  it('does not add entity if it already exists', () => {
    const Store = signalStore({ protectedState: false }, withEntities<User>());
    const store = new Store();

    patchState(store, addEntity(user1));

    const entityMap = store.entityMap();
    const ids = store.ids();
    const entities = store.entities();

    patchState(store, addEntity(user1));
    patchState(store, addEntity({ ...user1, firstName: 'Jack' }));

    expect(store.entityMap()).toBe(entityMap);
    expect(store.ids()).toBe(ids);
    expect(store.entities()).toBe(entities);

    expect(store.entityMap()).toEqual({ 1: user1 });
    expect(store.ids()).toEqual([1]);
    expect(store.entities()).toEqual([user1]);
  });

  it('adds entity to the specified collection if it does not exist', () => {
    const Store = signalStore(
      { protectedState: false },
      withEntities({
        entity: type<User>(),
        collection: 'user',
      })
    );
    const store = new Store();

    patchState(
      store,
      addEntity(user1, { collection: 'user' }),
      addEntity(user2, { collection: 'user' })
    );

    expect(store.userEntityMap()).toEqual({ 1: user1, 2: user2 });
    expect(store.userIds()).toEqual([1, 2]);
    expect(store.userEntities()).toEqual([user1, user2]);
  });

  it('does not add entity to the specified collection if it already exists', () => {
    const Store = signalStore(
      { protectedState: false },
      withEntities({
        entity: type<User>(),
        collection: 'user',
      })
    );
    const store = new Store();

    patchState(
      store,
      addEntity(user1, { collection: 'user' }),
      addEntity(user1, { collection: 'user' })
    );

    const userEntityMap = store.userEntityMap();
    const userIds = store.userIds();
    const userEntities = store.userEntities();

    patchState(
      store,
      addEntity(user1, { collection: 'user' }),
      addEntity(user1, { collection: 'user' }),
      addEntity({ ...user1, firstName: 'Jack' }, { collection: 'user' })
    );

    expect(store.userEntityMap()).toBe(userEntityMap);
    expect(store.userIds()).toBe(userIds);
    expect(store.userEntities()).toBe(userEntities);
    expect(store.userEntityMap()).toEqual({ 1: user1 });
    expect(store.userIds()).toEqual([1]);
    expect(store.userEntities()).toEqual([user1]);
  });

  it('adds entity with a custom id if it does not exist', () => {
    const Store = signalStore({ protectedState: false }, withEntities<Todo>());
    const store = new Store();

    patchState(store, addEntity(todo1, { selectId }));

    expect(store.entityMap()).toEqual({ x: todo1 });
    expect(store.ids()).toEqual(['x']);
    expect(store.entities()).toEqual([todo1]);

    patchState(store, addEntity(todo2, { selectId }));

    expect(store.entityMap()).toEqual({ x: todo1, y: todo2 });
    expect(store.ids()).toEqual(['x', 'y']);
    expect(store.entities()).toEqual([todo1, todo2]);
  });

  it('does not add entity with a custom id if it already exists', () => {
    const Store = signalStore({ protectedState: false }, withEntities<Todo>());
    const store = new Store();

    patchState(
      store,
      addEntity(todo1, { selectId }),
      addEntity(todo2, { selectId })
    );

    const entityMap = store.entityMap();
    const ids = store.ids();
    const entities = store.entities();

    patchState(
      store,
      addEntity(todo1, { selectId }),
      addEntity({ ...todo1, text: 'NgRx' }, { selectId }),
      addEntity(todo2, { selectId }),
      addEntity(todo1, { selectId })
    );

    expect(store.entityMap()).toBe(entityMap);
    expect(store.ids()).toBe(ids);
    expect(store.entities()).toBe(entities);
    expect(store.entityMap()).toEqual({ x: todo1, y: todo2 });
    expect(store.ids()).toEqual(['x', 'y']);
    expect(store.entities()).toEqual([todo1, todo2]);
  });

  it('adds entity with a custom id to the specified collection if it does not exist', () => {
    const Store = signalStore(
      { protectedState: false },
      withEntities({
        entity: type<Todo>(),
        collection: 'todo',
      })
    );
    const store = new Store();

    patchState(store, addEntity(todo1, { collection: 'todo', selectId }));

    expect(store.todoEntityMap()).toEqual({ x: todo1 });
    expect(store.todoIds()).toEqual(['x']);
    expect(store.todoEntities()).toEqual([todo1]);

    patchState(store, addEntity(todo2, { collection: 'todo', selectId }));

    expect(store.todoEntityMap()).toEqual({ x: todo1, y: todo2 });
    expect(store.todoIds()).toEqual(['x', 'y']);
    expect(store.todoEntities()).toEqual([todo1, todo2]);
  });

  it('does not add entity with a custom id to the specified collection if it already exists', () => {
    const todoConfig = entityConfig({
      entity: type<Todo>(),
      collection: 'todo',
      selectId,
    });

    const Store = signalStore(
      { protectedState: false },
      withEntities(todoConfig)
    );
    const store = new Store();

    patchState(
      store,
      addEntity(todo1, todoConfig),
      addEntity(todo2, todoConfig)
    );

    const todoEntityMap = store.todoEntityMap();
    const todoIds = store.todoIds();
    const todoEntities = store.todoEntities();

    patchState(
      store,
      addEntity(todo1, todoConfig),
      addEntity({ ...todo1, text: 'NgRx' }, todoConfig),
      addEntity(todo2, todoConfig),
      addEntity(todo1, todoConfig)
    );

    expect(store.todoEntityMap()).toBe(todoEntityMap);
    expect(store.todoIds()).toBe(todoIds);
    expect(store.todoEntities()).toBe(todoEntities);
    expect(store.todoEntityMap()).toEqual({ x: todo1, y: todo2 });
    expect(store.todoIds()).toEqual(['x', 'y']);
    expect(store.todoEntities()).toEqual([todo1, todo2]);
  });
});
