import { patchState, signalStore, type } from '@ngrx/signals';
import { addEntity, withEntities } from '../../src';
import { Todo, todo1, todo2, User, user1, user2 } from '../mocks';

describe('addEntity', () => {
  it('adds entity if it does not exist', () => {
    const Store = signalStore(withEntities<User>());
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
    const Store = signalStore(withEntities<User>());
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

  it('adds entity with the specified idKey if it does not exist', () => {
    const Store = signalStore(withEntities<Todo>());
    const store = new Store();

    patchState(store, addEntity(todo1, { idKey: '_id' }));

    expect(store.entityMap()).toEqual({ x: todo1 });
    expect(store.ids()).toEqual(['x']);
    expect(store.entities()).toEqual([todo1]);

    patchState(store, addEntity(todo2, { idKey: '_id' }));

    expect(store.entityMap()).toEqual({ x: todo1, y: todo2 });
    expect(store.ids()).toEqual(['x', 'y']);
    expect(store.entities()).toEqual([todo1, todo2]);
  });

  it('does not add entity with the specified idKey if it already exists', () => {
    const Store = signalStore(withEntities<Todo>());
    const store = new Store();

    patchState(
      store,
      addEntity(todo1, { idKey: '_id' }),
      addEntity(todo2, { idKey: '_id' })
    );

    const entityMap = store.entityMap();
    const ids = store.ids();
    const entities = store.entities();

    patchState(
      store,
      addEntity(todo1, { idKey: '_id' }),
      addEntity({ ...todo1, text: 'NgRx' }, { idKey: '_id' }),
      addEntity(todo2, { idKey: '_id' }),
      addEntity(todo1, { idKey: '_id' })
    );

    expect(store.entityMap()).toBe(entityMap);
    expect(store.ids()).toBe(ids);
    expect(store.entities()).toBe(entities);
    expect(store.entityMap()).toEqual({ x: todo1, y: todo2 });
    expect(store.ids()).toEqual(['x', 'y']);
    expect(store.entities()).toEqual([todo1, todo2]);
  });

  it('adds entity with the specified idKey to the specified collection if it does not exist', () => {
    const Store = signalStore(
      withEntities({
        entity: type<Todo>(),
        collection: 'todo',
      })
    );
    const store = new Store();

    patchState(store, addEntity(todo1, { collection: 'todo', idKey: '_id' }));

    expect(store.todoEntityMap()).toEqual({ x: todo1 });
    expect(store.todoIds()).toEqual(['x']);
    expect(store.todoEntities()).toEqual([todo1]);

    patchState(store, addEntity(todo2, { collection: 'todo', idKey: '_id' }));

    expect(store.todoEntityMap()).toEqual({ x: todo1, y: todo2 });
    expect(store.todoIds()).toEqual(['x', 'y']);
    expect(store.todoEntities()).toEqual([todo1, todo2]);
  });

  it('does not add entity with the specified idKey to the specified collection if it already exists', () => {
    const todoMeta = {
      entity: type<Todo>(),
      collection: 'todo',
      idKey: '_id',
    } as const;

    const Store = signalStore(withEntities(todoMeta));
    const store = new Store();

    patchState(store, addEntity(todo1, todoMeta), addEntity(todo2, todoMeta));

    const todoEntityMap = store.todoEntityMap();
    const todoIds = store.todoIds();
    const todoEntities = store.todoEntities();

    patchState(
      store,
      addEntity(todo1, todoMeta),
      addEntity({ ...todo1, text: 'NgRx' }, todoMeta),
      addEntity(todo2, todoMeta),
      addEntity(todo1, todoMeta)
    );

    expect(store.todoEntityMap()).toBe(todoEntityMap);
    expect(store.todoIds()).toBe(todoIds);
    expect(store.todoEntities()).toBe(todoEntities);
    expect(store.todoEntityMap()).toEqual({ x: todo1, y: todo2 });
    expect(store.todoIds()).toEqual(['x', 'y']);
    expect(store.todoEntities()).toEqual([todo1, todo2]);
  });
});
