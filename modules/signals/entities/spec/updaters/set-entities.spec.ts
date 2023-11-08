import { patchState, signalStore, type } from '@ngrx/signals';
import { setEntities, withEntities } from '../../src';
import { Todo, todo1, todo2, todo3, User, user1, user2, user3 } from '../mocks';

describe('setEntities', () => {
  it('adds entities if they do not exist', () => {
    const Store = signalStore(withEntities<User>());
    const store = new Store();

    patchState(store, setEntities([user1]));

    expect(store.entityMap()).toEqual({ 1: user1 });
    expect(store.ids()).toEqual([1]);
    expect(store.entities()).toEqual([user1]);

    patchState(store, setEntities([user2, user3]));

    expect(store.entityMap()).toEqual({ 1: user1, 2: user2, 3: user3 });
    expect(store.ids()).toEqual([1, 2, 3]);
    expect(store.entities()).toEqual([user1, user2, user3]);
  });

  it('replaces entities if they already exist', () => {
    const Store = signalStore(withEntities<User>());
    const store = new Store();

    patchState(
      store,
      setEntities([user1, user2, { ...user1, lastName: 'Hendrix' }])
    );

    expect(store.entityMap()).toEqual({
      1: { ...user1, lastName: 'Hendrix' },
      2: user2,
    });
    expect(store.ids()).toEqual([1, 2]);
    expect(store.entities()).toEqual([
      { ...user1, lastName: 'Hendrix' },
      user2,
    ]);

    patchState(
      store,
      setEntities([user3, user2, { ...user2, firstName: 'Jack' }]),
      setEntities([] as User[])
    );

    expect(store.entityMap()).toEqual({
      1: { ...user1, lastName: 'Hendrix' },
      2: { ...user2, firstName: 'Jack' },
      3: user3,
    });
    expect(store.ids()).toEqual([1, 2, 3]);
    expect(store.entities()).toEqual([
      { ...user1, lastName: 'Hendrix' },
      { ...user2, firstName: 'Jack' },
      user3,
    ]);
  });

  it('adds entities to the specified collection if they do not exist', () => {
    const Store = signalStore(
      withEntities({
        entity: type<User>(),
        collection: 'user',
      })
    );
    const store = new Store();

    patchState(
      store,
      setEntities([user1, user2], { collection: 'user' }),
      setEntities([user3], { collection: 'user' })
    );

    expect(store.userEntityMap()).toEqual({ 1: user1, 2: user2, 3: user3 });
    expect(store.userIds()).toEqual([1, 2, 3]);
    expect(store.userEntities()).toEqual([user1, user2, user3]);
  });

  it('replaces entities to the specified collection if they already exist', () => {
    const Store = signalStore(
      withEntities({
        entity: type<User>(),
        collection: 'user',
      })
    );
    const store = new Store();

    patchState(
      store,
      setEntities([user1, { ...user1, lastName: 'Hendrix' }, user3, user1], {
        collection: 'user',
      })
    );

    patchState(
      store,
      setEntities([] as User[], { collection: 'user' }),
      setEntities([user3, user2, { ...user3, firstName: 'Jimmy' }], {
        collection: 'user',
      })
    );

    expect(store.userEntityMap()).toEqual({
      1: user1,
      3: { ...user3, firstName: 'Jimmy' },
      2: user2,
    });
    expect(store.userIds()).toEqual([1, 3, 2]);
    expect(store.userEntities()).toEqual([
      user1,
      { ...user3, firstName: 'Jimmy' },
      user2,
    ]);
  });

  it('adds entities with the specified idKey if they do not exist', () => {
    const Store = signalStore(withEntities<Todo>());
    const store = new Store();

    patchState(store, setEntities([todo2, todo3], { idKey: '_id' }));

    expect(store.entityMap()).toEqual({ y: todo2, z: todo3 });
    expect(store.ids()).toEqual(['y', 'z']);
    expect(store.entities()).toEqual([todo2, todo3]);

    patchState(
      store,
      setEntities([todo1], { idKey: '_id' }),
      setEntities([] as Todo[], { idKey: '_id' })
    );

    expect(store.entityMap()).toEqual({ y: todo2, z: todo3, x: todo1 });
    expect(store.ids()).toEqual(['y', 'z', 'x']);
    expect(store.entities()).toEqual([todo2, todo3, todo1]);
  });

  it('replaces entities with the specified idKey if they already exist', () => {
    const Store = signalStore(withEntities<Todo>());
    const store = new Store();

    patchState(
      store,
      setEntities([todo1], { idKey: '_id' }),
      setEntities([todo2, { ...todo1, text: 'Signals' }], { idKey: '_id' }),
      setEntities([] as Todo[], { idKey: '_id' })
    );

    patchState(
      store,
      setEntities([] as Todo[], { idKey: '_id' }),
      setEntities([todo3, todo2, { ...todo2, text: 'NgRx' }, todo1], {
        idKey: '_id',
      })
    );

    expect(store.entityMap()).toEqual({
      x: todo1,
      y: { ...todo2, text: 'NgRx' },
      z: todo3,
    });
    expect(store.ids()).toEqual(['x', 'y', 'z']);
    expect(store.entities()).toEqual([
      todo1,
      { ...todo2, text: 'NgRx' },
      todo3,
    ]);
  });

  it('adds entities with the specified idKey to the specified collection if they do not exist', () => {
    const Store = signalStore(
      withEntities({
        entity: type<Todo>(),
        collection: 'todo',
      })
    );
    const store = new Store();

    patchState(
      store,
      setEntities([todo3, todo2], {
        collection: 'todo',
        idKey: '_id',
      })
    );

    expect(store.todoEntityMap()).toEqual({ z: todo3, y: todo2 });
    expect(store.todoIds()).toEqual(['z', 'y']);
    expect(store.todoEntities()).toEqual([todo3, todo2]);

    patchState(
      store,
      setEntities([todo1], { collection: 'todo', idKey: '_id' }),
      setEntities([] as Todo[], { collection: 'todo', idKey: '_id' })
    );

    expect(store.todoEntityMap()).toEqual({ z: todo3, y: todo2, x: todo1 });
    expect(store.todoIds()).toEqual(['z', 'y', 'x']);
    expect(store.todoEntities()).toEqual([todo3, todo2, todo1]);
  });

  it('replaces entities with the specified idKey to the specified collection if they already exist', () => {
    const todoMeta = {
      entity: type<Todo>(),
      collection: 'todo',
      idKey: '_id',
    } as const;

    const Store = signalStore(withEntities(todoMeta));
    const store = new Store();

    patchState(
      store,
      setEntities([todo2, { ...todo2, text: 'NgRx' }, todo3, todo2], todoMeta),
      setEntities([] as Todo[], todoMeta),
      setEntities([todo3, { ...todo3, text: 'NgRx' }, todo1], todoMeta)
    );

    expect(store.todoEntityMap()).toEqual({
      y: todo2,
      z: { ...todo3, text: 'NgRx' },
      x: todo1,
    });
    expect(store.todoIds()).toEqual(['y', 'z', 'x']);
    expect(store.todoEntities()).toEqual([
      todo2,
      { ...todo3, text: 'NgRx' },
      todo1,
    ]);
  });
});
