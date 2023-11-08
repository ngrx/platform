import { patchState, signalStore, type } from '@ngrx/signals';
import { addEntities, updateEntities, withEntities } from '../../src';
import { Todo, todo1, todo2, todo3, User, user1, user2, user3 } from '../mocks';

describe('updateEntities', () => {
  it('updates entities by ids', () => {
    const Store = signalStore(withEntities<User>());
    const store = new Store();

    patchState(
      store,
      addEntities([user1, user2, user3]),
      updateEntities({
        ids: [user1.id, user3.id, 'a'],
        changes: ({ id }) => ({ firstName: `Jimmy${id}` }),
      }),
      updateEntities({
        ids: [user1.id, user2.id, 'b'],
        changes: { lastName: 'Hendrix' },
      })
    );

    expect(store.entityMap()).toEqual({
      1: { id: 1, firstName: 'Jimmy1', lastName: 'Hendrix' },
      2: { ...user2, lastName: 'Hendrix' },
      3: { ...user3, firstName: 'Jimmy3' },
    });
    expect(store.ids()).toEqual([1, 2, 3]);
    expect(store.entities()).toEqual([
      { id: 1, firstName: 'Jimmy1', lastName: 'Hendrix' },
      { ...user2, lastName: 'Hendrix' },
      { ...user3, firstName: 'Jimmy3' },
    ]);
  });

  it('updates entities by predicate', () => {
    const Store = signalStore(withEntities<Todo>());
    const store = new Store();

    patchState(store, addEntities([todo1, todo2, todo3], { idKey: '_id' }));

    patchState(
      store,
      updateEntities({
        predicate: (todo) => todo.text.startsWith('Buy'),
        changes: { completed: false },
      }),
      updateEntities({
        predicate: ({ completed }) => !completed,
        changes: ({ text }) => ({ text: `Don't ${text}` }),
      })
    );

    expect(store.entityMap()).toEqual({
      x: { _id: 'x', text: `Don't Buy milk`, completed: false },
      y: { _id: 'y', text: `Don't Buy eggs`, completed: false },
      z: todo3,
    });
    expect(store.ids()).toEqual(['x', 'y', 'z']);
    expect(store.entities()).toEqual([
      { _id: 'x', text: `Don't Buy milk`, completed: false },
      { _id: 'y', text: `Don't Buy eggs`, completed: false },
      todo3,
    ]);
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
      updateEntities({
        ids: [20, 30],
        changes: ({ id }) => ({ firstName: `Jimmy${id}` }),
      }),
      updateEntities({
        predicate: (user) => user.id > 100,
        changes: { lastName: 'Hendrix' },
      })
    );

    expect(store.entityMap()).toBe(entityMap);
    expect(store.ids()).toBe(ids);
    expect(store.entities()).toBe(entities);

    expect(store.entityMap()).toEqual({ 1: user1, 2: user2, 3: user3 });
    expect(store.ids()).toEqual([1, 2, 3]);
    expect(store.entities()).toEqual([user1, user2, user3]);
  });

  it('updates entities by ids from specified collection', () => {
    const userMeta = {
      entity: type<User>(),
      collection: 'users',
    } as const;

    const Store = signalStore(withEntities(userMeta));
    const store = new Store();

    patchState(store, addEntities([user1, user2, user3], userMeta));
    patchState(
      store,
      updateEntities(
        {
          ids: [user1.id, user2.id, 20, 30],
          changes: { lastName: 'Hendrix' },
        },
        userMeta
      ),
      updateEntities(
        {
          ids: [user1.id, user3.id],
          changes: ({ id }) => ({ firstName: `Jimmy${id}` }),
        },
        userMeta
      )
    );

    expect(store.usersEntityMap()).toEqual({
      1: { id: 1, firstName: 'Jimmy1', lastName: 'Hendrix' },
      2: { ...user2, lastName: 'Hendrix' },
      3: { ...user3, firstName: 'Jimmy3' },
    });
    expect(store.usersIds()).toEqual([1, 2, 3]);
    expect(store.usersEntities()).toEqual([
      { id: 1, firstName: 'Jimmy1', lastName: 'Hendrix' },
      { ...user2, lastName: 'Hendrix' },
      { ...user3, firstName: 'Jimmy3' },
    ]);
  });

  it('updates entities by predicate from specified collection', () => {
    const userMeta = {
      entity: type<User>(),
      collection: 'users',
    } as const;

    const Store = signalStore(withEntities(userMeta));
    const store = new Store();

    patchState(
      store,
      addEntities([user1, user2, user3], userMeta),
      updateEntities(
        {
          predicate: ({ id }) => id < 3,
          changes: { lastName: 'Hendrix' },
        },
        userMeta
      ),
      updateEntities(
        {
          predicate: ({ id }) => id > 2,
          changes: ({ id }) => ({ firstName: `Jimmy${id}` }),
        },
        userMeta
      )
    );

    expect(store.usersEntityMap()).toEqual({
      1: { ...user1, lastName: 'Hendrix' },
      2: { ...user2, lastName: 'Hendrix' },
      3: { ...user3, firstName: 'Jimmy3' },
    });
    expect(store.usersIds()).toEqual([1, 2, 3]);
    expect(store.usersEntities()).toEqual([
      { ...user1, lastName: 'Hendrix' },
      { ...user2, lastName: 'Hendrix' },
      { ...user3, firstName: 'Jimmy3' },
    ]);
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
      updateEntities(
        {
          ids: ['a', 'b'],
          changes: { completed: false },
        },
        todoMeta
      ),
      updateEntities(
        {
          predicate: (todo) => todo.text === 'NgRx',
          changes: ({ text }) => ({ text: `Don't ${text}` }),
        },
        todoMeta
      )
    );

    expect(store.todoEntityMap()).toBe(todoEntityMap);
    expect(store.todoIds()).toBe(todoIds);
    expect(store.todoEntities()).toBe(todoEntities);

    expect(store.todoEntityMap()).toEqual({ x: todo1, y: todo2, z: todo3 });
    expect(store.todoIds()).toEqual(['x', 'y', 'z']);
    expect(store.todoEntities()).toEqual([todo1, todo2, todo3]);
  });
});
