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
    const Store = signalStore(withEntities<User>());
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

    const Store = signalStore(withEntities(todoConfig));
    const store = new Store();

    patchState(store, addEntities([todo2, todo3], todoConfig));

    const entityMap = store.entityMap();
    const ids = store.ids();
    const entities = store.entities();

    patchState(
      store,
      updateEntity({
        id: todo1._id,
        changes: { text: '' },
      }),
      updateEntity({
        id: 'a',
        changes: ({ completed }) => ({ completed: !completed }),
      })
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
        { collection: 'todo' }
      ),
      updateEntity(
        {
          id: todo2._id,
          changes: ({ completed }) => ({ completed: !completed }),
        },
        { collection: 'todo' }
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

    const Store = signalStore(withEntities(userConfig));
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
});
