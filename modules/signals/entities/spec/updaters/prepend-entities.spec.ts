import { patchState, signalStore, type } from '@ngrx/signals';
import { prependEntities, entityConfig, withEntities } from '../../src';
import { Todo, todo1, todo2, todo3, User, user1, user2, user3 } from '../mocks';
import { selectTodoId as selectId } from '../helpers';

describe('prependEntities', () => {
  it('prepends entities if they do not exist', () => {
    const Store = signalStore({ protectedState: false }, withEntities<User>());
    const store = new Store();

    patchState(store, prependEntities([user1]));

    expect(store.entityMap()).toEqual({ 1: user1 });
    expect(store.ids()).toEqual([1]);
    expect(store.entities()).toEqual([user1]);

    patchState(store, prependEntities([user2, user3]));

    expect(store.entityMap()).toEqual({ 1: user1, 2: user2, 3: user3 });
    expect(store.ids()).toEqual([2, 3, 1]);
    expect(store.entities()).toEqual([user2, user3, user1]);
  });

  it('does not add entities if they already exist', () => {
    const Store = signalStore({ protectedState: false }, withEntities<User>());
    const store = new Store();

    patchState(store, prependEntities([user1, user2]));

    const entityMap = store.entityMap();
    const ids = store.ids();
    const entities = store.entities();

    patchState(
      store,
      prependEntities([user2, { ...user2, firstName: 'Jack' }, user1]),
      prependEntities([] as User[])
    );

    expect(store.entityMap()).toBe(entityMap);
    expect(store.ids()).toBe(ids);
    expect(store.entities()).toBe(entities);

    expect(store.entityMap()).toEqual({ 1: user1, 2: user2 });
    expect(store.ids()).toEqual([1, 2]);
    expect(store.entities()).toEqual([user1, user2]);

    patchState(store, prependEntities([user1, user3, user2]));

    expect(store.entityMap()).toEqual({ 1: user1, 2: user2, 3: user3 });
    expect(store.ids()).toEqual([3, 1, 2]);
    expect(store.entities()).toEqual([user3, user1, user2]);
  });

  it('prepends entities to the specified collection if they do not exist', () => {
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
      prependEntities([user1, user2], { collection: 'user' }),
      prependEntities([user3], { collection: 'user' })
    );

    expect(store.userEntityMap()).toEqual({ 1: user1, 2: user2, 3: user3 });
    expect(store.userIds()).toEqual([3, 1, 2]);
    expect(store.userEntities()).toEqual([user3, user1, user2]);
  });

  it('does not add entities to the specified collection if they already exist', () => {
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
      prependEntities(
        [user1, { ...user1, lastName: 'Hendrix' }, user3, user1],
        {
          collection: 'user',
        }
      )
    );

    const userEntityMap = store.userEntityMap();
    const userIds = store.userIds();
    const userEntities = store.userEntities();

    patchState(
      store,
      prependEntities([] as User[], { collection: 'user' }),
      prependEntities([user3, { ...user3, firstName: 'Jimmy' }, user1], {
        collection: 'user',
      })
    );

    expect(store.userEntityMap()).toBe(userEntityMap);
    expect(store.userIds()).toBe(userIds);
    expect(store.userEntities()).toBe(userEntities);
    expect(store.userEntityMap()).toEqual({ 1: user1, 3: user3 });
    expect(store.userIds()).toEqual([1, 3]);
    expect(store.userEntities()).toEqual([user1, user3]);

    patchState(
      store,
      prependEntities([user1, user2, user3], { collection: 'user' })
    );
    expect(store.userEntityMap()).toEqual({ 1: user1, 3: user3, 2: user2 });
    expect(store.userIds()).toEqual([2, 1, 3]);
    expect(store.userEntities()).toEqual([user2, user1, user3]);
  });

  it('prepends entities with a custom id if they do not exist', () => {
    const Store = signalStore({ protectedState: false }, withEntities<Todo>());
    const store = new Store();

    patchState(store, prependEntities([todo2, todo3], { selectId }));

    expect(store.entityMap()).toEqual({ y: todo2, z: todo3 });
    expect(store.ids()).toEqual(['y', 'z']);
    expect(store.entities()).toEqual([todo2, todo3]);

    patchState(
      store,
      prependEntities([todo1], { selectId }),
      prependEntities([] as Todo[], { selectId })
    );

    expect(store.entityMap()).toEqual({ y: todo2, z: todo3, x: todo1 });
    expect(store.ids()).toEqual(['x', 'y', 'z']);
    expect(store.entities()).toEqual([todo1, todo2, todo3]);
  });

  it('does not add entities with a custom id if they already exist', () => {
    const Store = signalStore({ protectedState: false }, withEntities<Todo>());
    const store = new Store();

    patchState(
      store,
      prependEntities([todo1], { selectId }),
      prependEntities([todo2, todo1], { selectId }),
      prependEntities([] as Todo[], { selectId })
    );

    const entityMap = store.entityMap();
    const ids = store.ids();
    const entities = store.entities();

    patchState(
      store,
      prependEntities([] as Todo[], { selectId }),
      prependEntities([todo2, { ...todo2, text: 'NgRx' }, todo1], { selectId })
    );

    expect(store.entityMap()).toBe(entityMap);
    expect(store.ids()).toBe(ids);
    expect(store.entities()).toBe(entities);
    expect(store.entityMap()).toEqual({ x: todo1, y: todo2 });
    expect(store.ids()).toEqual(['y', 'x']);
    expect(store.entities()).toEqual([todo2, todo1]);

    patchState(store, prependEntities([todo1, todo3, todo2], { selectId }));

    expect(store.entityMap()).toEqual({ x: todo1, y: todo2, z: todo3 });
    expect(store.ids()).toEqual(['z', 'y', 'x']);
    expect(store.entities()).toEqual([todo3, todo2, todo1]);
  });

  it('prepends entities with a custom id to the specified collection if they do not exist', () => {
    const Store = signalStore(
      { protectedState: false },
      withEntities({
        entity: type<Todo>(),
        collection: 'todo',
      })
    );
    const store = new Store();

    patchState(
      store,
      prependEntities([todo3, todo2], {
        collection: 'todo',
        selectId,
      })
    );

    expect(store.todoEntityMap()).toEqual({ z: todo3, y: todo2 });
    expect(store.todoIds()).toEqual(['z', 'y']);
    expect(store.todoEntities()).toEqual([todo3, todo2]);

    patchState(
      store,
      prependEntities([todo1], { collection: 'todo', selectId }),
      prependEntities([] as Todo[], { collection: 'todo', selectId })
    );

    expect(store.todoEntityMap()).toEqual({ z: todo3, y: todo2, x: todo1 });
    expect(store.todoIds()).toEqual(['x', 'z', 'y']);
    expect(store.todoEntities()).toEqual([todo1, todo3, todo2]);
  });

  it('does not add entities with a custom id to the specified collection if they already exist', () => {
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
      prependEntities(
        [todo2, { ...todo2, text: 'NgRx' }, todo3, todo2],
        todoConfig
      )
    );

    const todoEntityMap = store.todoEntityMap();
    const todoIds = store.todoIds();
    const todoEntities = store.todoEntities();

    patchState(
      store,
      prependEntities([] as Todo[], todoConfig),
      prependEntities([todo3, todo2, { ...todo3, text: 'NgRx' }], todoConfig)
    );

    expect(store.todoEntityMap()).toBe(todoEntityMap);
    expect(store.todoIds()).toBe(todoIds);
    expect(store.todoEntities()).toBe(todoEntities);
    expect(store.todoEntityMap()).toEqual({ y: todo2, z: todo3 });
    expect(store.todoIds()).toEqual(['y', 'z']);
    expect(store.todoEntities()).toEqual([todo2, todo3]);

    patchState(store, prependEntities([todo1, todo2, todo3], todoConfig));

    expect(store.todoEntityMap()).toEqual({ y: todo2, z: todo3, x: todo1 });
    expect(store.todoIds()).toEqual(['x', 'y', 'z']);
    expect(store.todoEntities()).toEqual([todo1, todo2, todo3]);
  });

  it('maintains correct order when adding multiple batches of entities', () => {
    const Store = signalStore({ protectedState: false }, withEntities<User>());
    const store = new Store();

    patchState(store, prependEntities([user1]));

    expect(store.ids()).toEqual([1]);
    expect(store.entities()).toEqual([user1]);

    patchState(store, prependEntities([user2, user3]));

    expect(store.ids()).toEqual([2, 3, 1]);
    expect(store.entities()).toEqual([user2, user3, user1]);
  });

  it('preserves entity order when prepending multiple times', () => {
    const Store = signalStore({ protectedState: false }, withEntities<Todo>());
    const store = new Store();

    patchState(store, prependEntities([todo1], { selectId }));

    expect(store.entityMap()).toEqual({ x: todo1 });
    expect(store.ids()).toEqual(['x']);

    patchState(store, prependEntities([todo2, todo3], { selectId }));

    expect(store.ids()).toEqual(['y', 'z', 'x']);
    expect(store.entities()).toEqual([todo2, todo3, todo1]);
  });
});
