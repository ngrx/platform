import { patchState, signalStore, type } from '@ngrx/signals';
import {
  addEntities,
  entityConfig,
  updateEntities,
  withEntities,
} from '../../src';
import { Todo, todo1, todo2, todo3, User, user1, user2, user3 } from '../mocks';
import { selectTodoId } from '../helpers';

describe('updateEntities', () => {
  it('updates entities by ids', () => {
    const Store = signalStore({ protectedState: false }, withEntities<User>());
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
    const Store = signalStore({ protectedState: false }, withEntities<Todo>());
    const store = new Store();

    patchState(
      store,
      addEntities([todo1, todo2, todo3], { selectId: selectTodoId })
    );

    patchState(
      store,
      updateEntities(
        {
          predicate: (todo) => todo.text.startsWith('Buy'),
          changes: { completed: false },
        },
        { selectId: (todo) => todo._id }
      ),
      updateEntities(
        {
          predicate: ({ completed }) => !completed,
          changes: ({ text }) => ({ text: `Don't ${text}` }),
        },
        { selectId: (todo) => todo._id }
      )
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
    const Store = signalStore({ protectedState: false }, withEntities<User>());
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
    patchState(
      store,
      updateEntities(
        {
          ids: [user1.id, user2.id, 20, 30],
          changes: { lastName: 'Hendrix' },
        },
        userConfig
      ),
      updateEntities(
        {
          ids: [user1.id, user3.id],
          changes: ({ id }) => ({ firstName: `Jimmy${id}` }),
        },
        userConfig
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
      updateEntities(
        {
          predicate: ({ id }) => id < 3,
          changes: { lastName: 'Hendrix' },
        },
        userConfig
      ),
      updateEntities(
        {
          predicate: ({ id }) => id > 2,
          changes: ({ id }) => ({ firstName: `Jimmy${id}` }),
        },
        userConfig
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
    const todoConfig = entityConfig({
      entity: type<Todo>(),
      collection: 'todo',
      selectId: (todo) => todo._id,
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
      updateEntities(
        {
          ids: ['a', 'b'],
          changes: { completed: false },
        },
        todoConfig
      ),
      updateEntities(
        {
          predicate: (todo) => todo.text === 'NgRx',
          changes: ({ text }) => ({ text: `Don't ${text}` }),
        },
        todoConfig
      )
    );

    expect(store.todoEntityMap()).toBe(todoEntityMap);
    expect(store.todoIds()).toBe(todoIds);
    expect(store.todoEntities()).toBe(todoEntities);

    expect(store.todoEntityMap()).toEqual({ x: todo1, y: todo2, z: todo3 });
    expect(store.todoIds()).toEqual(['x', 'y', 'z']);
    expect(store.todoEntities()).toEqual([todo1, todo2, todo3]);
  });

  it('updates entity ids', () => {
    const Store = signalStore({ protectedState: false }, withEntities<User>());
    const store = new Store();

    patchState(
      store,
      addEntities([user1, user2, user3]),
      updateEntities({
        ids: [user1.id, user2.id],
        changes: ({ id }) => ({ id: id + 10, firstName: `Jimmy${id}` }),
      }),
      updateEntities({
        ids: [user3.id],
        changes: { id: 303, lastName: 'Hendrix' },
      })
    );

    expect(store.entityMap()).toEqual({
      11: { ...user1, id: 11, firstName: 'Jimmy1' },
      12: { ...user2, id: 12, firstName: 'Jimmy2' },
      303: { ...user3, id: 303, lastName: 'Hendrix' },
    });
    expect(store.ids()).toEqual([11, 12, 303]);

    patchState(
      store,
      updateEntities({
        predicate: ({ id }) => id > 300,
        changes: ({ id }) => ({ id: id - 300 }),
      }),
      updateEntities({
        predicate: ({ firstName }) => firstName === 'Jimmy1',
        changes: { id: 1, firstName: 'Jimmy' },
      })
    );

    expect(store.entityMap()).toEqual({
      1: { ...user1, id: 1, firstName: 'Jimmy' },
      12: { ...user2, id: 12, firstName: 'Jimmy2' },
      3: { ...user3, id: 3, lastName: 'Hendrix' },
    });
    expect(store.ids()).toEqual([1, 12, 3]);
  });

  it('updates custom entity ids', () => {
    const Store = signalStore({ protectedState: false }, withEntities<Todo>());
    const store = new Store();

    patchState(
      store,
      addEntities([todo1, todo2, todo3], { selectId: (todo) => todo._id }),
      updateEntities(
        {
          ids: [todo1._id, todo2._id],
          changes: ({ _id }) => ({ _id: _id + 10, text: `Todo ${_id}` }),
        },
        { selectId: (todo) => todo._id }
      ),
      updateEntities(
        {
          ids: [todo3._id],
          changes: { _id: 'z30' },
        },
        { selectId: (todo) => todo._id }
      )
    );

    expect(store.entityMap()).toEqual({
      x10: { ...todo1, _id: 'x10', text: 'Todo x' },
      y10: { ...todo2, _id: 'y10', text: 'Todo y' },
      z30: { ...todo3, _id: 'z30' },
    });
    expect(store.ids()).toEqual(['x10', 'y10', 'z30']);

    patchState(
      store,
      updateEntities(
        {
          predicate: ({ text }) => text.startsWith('Todo '),
          changes: ({ _id }) => ({ _id: `${_id}0` }),
        },
        { selectId: (todo) => todo._id }
      ),
      updateEntities(
        {
          predicate: ({ _id }) => _id === 'z30',
          changes: { _id: 'z' },
        },
        { selectId: (todo) => todo._id }
      )
    );

    expect(store.entityMap()).toEqual({
      x100: { ...todo1, _id: 'x100', text: 'Todo x' },
      y100: { ...todo2, _id: 'y100', text: 'Todo y' },
      z: { ...todo3, _id: 'z' },
    });
    expect(store.ids()).toEqual(['x100', 'y100', 'z']);
  });

  it('updates entity ids from specified collection', () => {
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
      addEntities([user1, user2, user3], { collection: 'user' }),
      updateEntities(
        {
          ids: [user1.id, user2.id],
          changes: ({ id }) => ({ id: id + 100, firstName: `Jimmy${id}` }),
        },
        { collection: 'user' }
      ),
      updateEntities(
        {
          ids: [user3.id],
          changes: { id: 303, lastName: 'Hendrix' },
        },
        { collection: 'user' }
      )
    );

    expect(store.userEntityMap()).toEqual({
      101: { ...user1, id: 101, firstName: 'Jimmy1' },
      102: { ...user2, id: 102, firstName: 'Jimmy2' },
      303: { ...user3, id: 303, lastName: 'Hendrix' },
    });
    expect(store.userIds()).toEqual([101, 102, 303]);

    patchState(
      store,
      updateEntities(
        {
          predicate: ({ id }) => id > 300,
          changes: ({ id }) => ({ id: id - 300 }),
        },
        { collection: 'user' }
      ),
      updateEntities(
        {
          predicate: ({ firstName }) => firstName === 'Jimmy1',
          changes: { id: 1, firstName: 'Jimmy' },
        },
        { collection: 'user' }
      )
    );

    expect(store.userEntityMap()).toEqual({
      1: { ...user1, id: 1, firstName: 'Jimmy' },
      102: { ...user2, id: 102, firstName: 'Jimmy2' },
      3: { ...user3, id: 3, lastName: 'Hendrix' },
    });
    expect(store.userIds()).toEqual([1, 102, 3]);
  });

  it('updates custom entity ids from specified collection', () => {
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
      addEntities([todo1, todo2, todo3], {
        collection: 'todo',
        selectId: (todo) => todo._id,
      }),
      updateEntities(
        {
          ids: [todo1._id, todo2._id],
          changes: ({ _id }) => ({ _id: _id + 10, text: `Todo ${_id}` }),
        },
        { collection: 'todo', selectId: (todo) => todo._id }
      ),
      updateEntities(
        {
          ids: [todo3._id],
          changes: { _id: 'z30' },
        },
        { collection: 'todo', selectId: (todo) => todo._id }
      )
    );

    expect(store.todoEntityMap()).toEqual({
      x10: { ...todo1, _id: 'x10', text: 'Todo x' },
      y10: { ...todo2, _id: 'y10', text: 'Todo y' },
      z30: { ...todo3, _id: 'z30' },
    });
    expect(store.todoIds()).toEqual(['x10', 'y10', 'z30']);

    patchState(
      store,
      updateEntities(
        {
          predicate: ({ text }) => text.startsWith('Todo '),
          changes: ({ _id }) => ({ _id: `${_id}0` }),
        },
        { collection: 'todo', selectId: (todo) => todo._id }
      ),
      updateEntities(
        {
          predicate: ({ _id }) => _id === 'z30',
          changes: { _id: 'z' },
        },
        { collection: 'todo', selectId: (todo) => todo._id }
      )
    );

    expect(store.todoEntityMap()).toEqual({
      x100: { ...todo1, _id: 'x100', text: 'Todo x' },
      y100: { ...todo2, _id: 'y100', text: 'Todo y' },
      z: { ...todo3, _id: 'z' },
    });
    expect(store.todoIds()).toEqual(['x100', 'y100', 'z']);
  });
});
