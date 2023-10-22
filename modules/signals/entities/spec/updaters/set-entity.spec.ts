import { patchState, signalStore, type } from '@ngrx/signals';
import { setEntity, withEntities } from '../../src';
import { Todo, todo1, todo2, User, user1, user2, user3 } from '../mocks';

describe('setEntity', () => {
  it('adds entity if it does not exist', () => {
    const Store = signalStore(withEntities<User>());
    const store = new Store();

    patchState(store, setEntity(user1));

    expect(store.entityMap()).toEqual({ 1: user1 });
    expect(store.ids()).toEqual([1]);
    expect(store.entities()).toEqual([user1]);

    patchState(store, setEntity(user2));

    expect(store.entityMap()).toEqual({ 1: user1, 2: user2 });
    expect(store.ids()).toEqual([1, 2]);
    expect(store.entities()).toEqual([user1, user2]);
  });

  it('replaces entity if it already exists', () => {
    const Store = signalStore(withEntities<User>());
    const store = new Store();

    patchState(store, setEntity(user1), setEntity(user2));
    patchState(store, setEntity({ ...user1, firstName: 'Jack' }));

    expect(store.entityMap()).toEqual({
      1: { ...user1, firstName: 'Jack' },
      2: user2,
    });
    expect(store.ids()).toEqual([1, 2]);
    expect(store.entities()).toEqual([{ ...user1, firstName: 'Jack' }, user2]);
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
      setEntity(user1, { collection: 'user' }),
      setEntity(user2, { collection: 'user' })
    );

    expect(store.userEntityMap()).toEqual({ 1: user1, 2: user2 });
    expect(store.userIds()).toEqual([1, 2]);
    expect(store.userEntities()).toEqual([user1, user2]);
  });

  it('replaces entity to the specified collection if it already exists', () => {
    const Store = signalStore(
      withEntities({
        entity: type<User>(),
        collection: 'user',
      })
    );
    const store = new Store();

    patchState(
      store,
      setEntity(user2, { collection: 'user' }),
      setEntity(user1, { collection: 'user' }),
      setEntity({ ...user1, lastName: 'Hendrix' }, { collection: 'user' }),
      setEntity(user3, { collection: 'user' }),
      setEntity({ ...user1, firstName: 'Jimmy' }, { collection: 'user' })
    );

    expect(store.userEntityMap()).toEqual({
      2: user2,
      1: { ...user1, firstName: 'Jimmy' },
      3: user3,
    });
    expect(store.userIds()).toEqual([2, 1, 3]);
    expect(store.userEntities()).toEqual([
      user2,
      { ...user1, firstName: 'Jimmy' },
      user3,
    ]);
  });

  it('adds entity with the specified idKey if it does not exist', () => {
    const Store = signalStore(withEntities<Todo>());
    const store = new Store();

    patchState(store, setEntity(todo1, { idKey: '_id' }));

    expect(store.entityMap()).toEqual({ x: todo1 });
    expect(store.ids()).toEqual(['x']);
    expect(store.entities()).toEqual([todo1]);

    patchState(store, setEntity(todo2, { idKey: '_id' }));

    expect(store.entityMap()).toEqual({ x: todo1, y: todo2 });
    expect(store.ids()).toEqual(['x', 'y']);
    expect(store.entities()).toEqual([todo1, todo2]);
  });

  it('replaces entity with the specified idKey if it already exists', () => {
    const Store = signalStore(withEntities<Todo>());
    const store = new Store();

    patchState(
      store,
      setEntity(todo1, { idKey: '_id' }),
      setEntity(todo2, { idKey: '_id' })
    );
    patchState(store, setEntity({ ...todo2, text: 'NgRx' }, { idKey: '_id' }));

    expect(store.entityMap()).toEqual({
      x: todo1,
      y: { ...todo2, text: 'NgRx' },
    });
    expect(store.ids()).toEqual(['x', 'y']);
    expect(store.entities()).toEqual([todo1, { ...todo2, text: 'NgRx' }]);
  });

  it('adds entity with the specified idKey to the specified collection if it does not exist', () => {
    const Store = signalStore(
      withEntities({
        entity: type<Todo>(),
        collection: 'todo',
      })
    );
    const store = new Store();

    patchState(store, setEntity(todo1, { collection: 'todo', idKey: '_id' }));

    expect(store.todoEntityMap()).toEqual({ x: todo1 });
    expect(store.todoIds()).toEqual(['x']);
    expect(store.todoEntities()).toEqual([todo1]);

    patchState(store, setEntity(todo2, { collection: 'todo', idKey: '_id' }));

    expect(store.todoEntityMap()).toEqual({ x: todo1, y: todo2 });
    expect(store.todoIds()).toEqual(['x', 'y']);
    expect(store.todoEntities()).toEqual([todo1, todo2]);
  });

  it('replaces entity with the specified idKey to the specified collection if it already exists', () => {
    const todoMeta = {
      entity: type<Todo>(),
      collection: 'todo',
      idKey: '_id',
    } as const;

    const Store = signalStore(withEntities(todoMeta));
    const store = new Store();

    patchState(store, setEntity(todo1, todoMeta), setEntity(todo2, todoMeta));
    patchState(
      store,
      setEntity({ ...todo2, text: 'Signals' }, todoMeta),
      setEntity(todo1, todoMeta),
      setEntity({ ...todo1, text: 'NgRx' }, todoMeta),
      setEntity(todo2, todoMeta)
    );

    expect(store.todoEntityMap()).toEqual({
      x: { ...todo1, text: 'NgRx' },
      y: todo2,
    });
    expect(store.todoIds()).toEqual(['x', 'y']);
    expect(store.todoEntities()).toEqual([{ ...todo1, text: 'NgRx' }, todo2]);
  });
});
