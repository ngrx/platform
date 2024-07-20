import { patchState, signalStore, type } from '@ngrx/signals';
import {
  addEntities,
  entityConfig,
  updateEntity,
  withEntities,
} from '../../src';
import { Todo, todo1, todo2, todo3, User, user1, user2, user3 } from '../mocks';
import { selectTodoId } from '../helpers';

describe('updateEntity', () => {
  it('updates entity', () => {
    const Store = signalStore({ protectedState: false }, withEntities<User>());
    const store = new Store();

    patchState(
      store,
      addEntities([user1, user2, user3]),
      updateEntity({
        id: user1.id,
        changes: ({ id }) => ({ firstName: `Jimmy${id}` }),
      })
    );

    expect(store.entityMap()).toEqual({
      1: { ...user1, firstName: 'Jimmy1' },
      2: user2,
      3: user3,
    });
    expect(store.ids()).toEqual([1, 2, 3]);
    expect(store.entities()).toEqual([
      { ...user1, firstName: 'Jimmy1' },
      user2,
      user3,
    ]);

    patchState(
      store,
      updateEntity({
        id: user1.id,
        changes: { lastName: 'Hendrix' },
      }),
      updateEntity({
        id: user3.id,
        changes: ({ id }) => ({ firstName: `Stevie${id}` }),
      })
    );

    expect(store.entityMap()).toEqual({
      1: { id: 1, firstName: 'Jimmy1', lastName: 'Hendrix' },
      2: user2,
      3: { ...user3, firstName: 'Stevie3' },
    });
    expect(store.ids()).toEqual([1, 2, 3]);
    expect(store.entities()).toEqual([
      { id: 1, firstName: 'Jimmy1', lastName: 'Hendrix' },
      user2,
      { ...user3, firstName: 'Stevie3' },
    ]);
  });

  it('does not modify entity state if entity do not exist', () => {
    const todoConfig = entityConfig({
      entity: type<Todo>(),
      selectId: selectTodoId,
    });

    const Store = signalStore(
      { protectedState: false },
      withEntities(todoConfig)
    );
    const store = new Store();

    patchState(store, addEntities([todo2, todo3], todoConfig));

    const entityMap = store.entityMap();
    const ids = store.ids();
    const entities = store.entities();

    patchState(
      store,
      updateEntity(
        {
          id: todo1._id,
          changes: { text: '' },
        },
        todoConfig
      ),
      updateEntity(
        {
          id: 'a',
          changes: ({ completed }) => ({ completed: !completed }),
        },
        todoConfig
      )
    );

    expect(store.entityMap()).toBe(entityMap);
    expect(store.ids()).toBe(ids);
    expect(store.entities()).toBe(entities);

    expect(store.entityMap()).toEqual({ y: todo2, z: todo3 });
    expect(store.ids()).toEqual(['y', 'z']);
    expect(store.entities()).toEqual([todo2, todo3]);
  });

  it('updates entity from specified entity collection', () => {
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
        selectId: selectTodoId,
      }),
      updateEntity(
        { id: todo1._id, changes: { text: '' } },
        { collection: 'todo', selectId: selectTodoId }
      ),
      updateEntity(
        {
          id: todo2._id,
          changes: ({ completed }) => ({ completed: !completed }),
        },
        { collection: 'todo', selectId: (todo) => todo._id }
      )
    );

    expect(store.todoEntityMap()).toEqual({
      x: { ...todo1, text: '' },
      y: { ...todo2, completed: true },
      z: todo3,
    });
    expect(store.todoIds()).toEqual(['x', 'y', 'z']);
    expect(store.todoEntities()).toEqual([
      { ...todo1, text: '' },
      { ...todo2, completed: true },
      todo3,
    ]);
  });

  it('does not modify entity state if entity do not exist in specified collection', () => {
    const userConfig = entityConfig({
      entity: type<User>(),
      collection: 'user',
      selectId: (user) => user.id,
    });

    const Store = signalStore(
      { protectedState: false },
      withEntities(userConfig)
    );
    const store = new Store();

    patchState(store, addEntities([user1, user2, user3], userConfig));

    const userEntityMap = store.userEntityMap();
    const userEntities = store.userEntities();
    const userIds = store.userIds();

    patchState(
      store,
      updateEntity({ id: 10, changes: { firstName: '' } }, userConfig),
      updateEntity(
        {
          id: 100,
          changes: ({ id, lastName }) => ({ lastName: `${lastName}${id}` }),
        },
        userConfig
      )
    );

    expect(store.userEntityMap()).toBe(userEntityMap);
    expect(store.userIds()).toBe(userIds);
    expect(store.userEntities()).toBe(userEntities);

    expect(store.userEntityMap()).toEqual({ 1: user1, 2: user2, 3: user3 });
    expect(store.userIds()).toEqual([1, 2, 3]);
    expect(store.userEntities()).toEqual([user1, user2, user3]);
  });

  it('updates an entity id', () => {
    const Store = signalStore({ protectedState: false }, withEntities<User>());
    const store = new Store();

    patchState(
      store,
      addEntities([user1, user2, user3]),
      updateEntity({
        id: user1.id,
        changes: ({ id }) => ({ id: id + 10 }),
      })
    );

    expect(store.entityMap()).toEqual({
      11: { ...user1, id: 11 },
      2: user2,
      3: user3,
    });
    expect(store.ids()).toEqual([11, 2, 3]);
    expect(store.entities()).toEqual([{ ...user1, id: 11 }, user2, user3]);

    patchState(
      store,
      updateEntity({
        id: 11,
        changes: { id: 101, firstName: 'Jimmy1' },
      }),
      updateEntity({
        id: user3.id,
        changes: ({ id }) => ({ id: 303, firstName: `Stevie${id}` }),
      })
    );

    expect(store.entityMap()).toEqual({
      101: { ...user1, id: 101, firstName: 'Jimmy1' },
      2: user2,
      303: { ...user3, id: 303, firstName: 'Stevie3' },
    });
    expect(store.ids()).toEqual([101, 2, 303]);
  });

  it('updates a custom entity id', () => {
    const Store = signalStore({ protectedState: false }, withEntities<Todo>());
    const store = new Store();

    patchState(
      store,
      addEntities([todo1, todo2, todo3], {
        selectId: (todo) => todo._id,
      }),
      updateEntity(
        {
          id: todo2._id,
          changes: ({ _id, text }) => ({ _id: _id + 200, text: `${text} 200` }),
        },
        { selectId: (todo) => todo._id }
      ),
      updateEntity(
        {
          id: todo3._id,
          changes: { _id: 'z300', text: 'Todo 300' },
        },
        { selectId: (todo) => todo._id }
      )
    );

    expect(store.entityMap()).toEqual({
      x: todo1,
      y200: { ...todo2, _id: 'y200', text: 'Buy eggs 200' },
      z300: { ...todo3, _id: 'z300', text: 'Todo 300' },
    });
    expect(store.ids()).toEqual(['x', 'y200', 'z300']);
  });

  it('updates an entity id from specified entity collection', () => {
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
      updateEntity(
        {
          id: user1.id,
          changes: ({ id }) => ({ id: id + 100, firstName: 'Jimi' }),
        },
        { collection: 'user' }
      ),
      updateEntity(
        {
          id: user2.id,
          changes: { id: 202, lastName: 'Hendrix' },
        },
        { collection: 'user' }
      )
    );

    expect(store.userEntityMap()).toEqual({
      101: { ...user1, id: 101, firstName: 'Jimi' },
      202: { ...user2, id: 202, lastName: 'Hendrix' },
      3: user3,
    });
    expect(store.userIds()).toEqual([101, 202, 3]);
  });

  it('updates a custom entity id from specified entity collection', () => {
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
      updateEntity(
        {
          id: todo2._id,
          changes: ({ _id }) => ({ _id: `${_id}200`, text: 'Todo 200' }),
        },
        { collection: 'todo', selectId: (todo) => todo._id }
      ),
      updateEntity(
        {
          id: todo3._id,
          changes: { _id: '303' },
        },
        { collection: 'todo', selectId: (todo) => todo._id }
      )
    );

    expect(store.todoEntityMap()).toEqual({
      x: todo1,
      y200: { ...todo2, _id: 'y200', text: 'Todo 200' },
      303: { ...todo3, _id: '303' },
    });
    expect(store.todoIds()).toEqual(['x', 'y200', '303']);
  });
});
