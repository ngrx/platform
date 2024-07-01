import { patchState, signalStore, type } from '@ngrx/signals';
import { addEntities, updateAllEntities, withEntities } from '../../src';
import { Todo, todo1, todo2, todo3, User, user1, user2, user3 } from '../mocks';
import { selectTodoId } from '../helpers';

describe('updateAllEntities', () => {
  it('updates all entities', () => {
    const Store = signalStore(withEntities<User>());
    const store = new Store();

    patchState(
      store,
      addEntities([user1, user2, user3]),
      updateAllEntities((user) => ({ firstName: `Jimmy${user.id}` }))
    );

    expect(store.entityMap()).toEqual({
      1: { ...user1, firstName: 'Jimmy1' },
      2: { ...user2, firstName: 'Jimmy2' },
      3: { ...user3, firstName: 'Jimmy3' },
    });
    expect(store.ids()).toEqual([1, 2, 3]);
    expect(store.entities()).toEqual([
      { ...user1, firstName: 'Jimmy1' },
      { ...user2, firstName: 'Jimmy2' },
      { ...user3, firstName: 'Jimmy3' },
    ]);

    patchState(store, updateAllEntities({ lastName: 'Hendrix' }));

    expect(store.entityMap()).toEqual({
      1: { id: 1, firstName: 'Jimmy1', lastName: 'Hendrix' },
      2: { id: 2, firstName: 'Jimmy2', lastName: 'Hendrix' },
      3: { id: 3, firstName: 'Jimmy3', lastName: 'Hendrix' },
    });
    expect(store.ids()).toEqual([1, 2, 3]);
    expect(store.entities()).toEqual([
      { id: 1, firstName: 'Jimmy1', lastName: 'Hendrix' },
      { id: 2, firstName: 'Jimmy2', lastName: 'Hendrix' },
      { id: 3, firstName: 'Jimmy3', lastName: 'Hendrix' },
    ]);
  });

  it('does not modify entity state if entities do not exist', () => {
    const Store = signalStore(withEntities<Todo>());
    const store = new Store();

    const entityMap = store.entityMap();
    const ids = store.ids();
    const entities = store.entities();

    patchState(
      store,
      updateAllEntities({ text: '' }, { selectId: (todo) => todo._id }),
      updateAllEntities((todo) => ({ completed: !todo.completed }), {
        selectId: (todo) => todo._id,
      })
    );

    expect(store.entityMap()).toBe(entityMap);
    expect(store.ids()).toBe(ids);
    expect(store.entities()).toBe(entities);

    expect(store.entityMap()).toEqual({});
    expect(store.ids()).toEqual([]);
    expect(store.entities()).toEqual([]);
  });

  it('updates all entities from specified entity collection', () => {
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
      updateAllEntities(
        { completed: false },
        {
          collection: 'todo',
          selectId: (todo) => todo._id,
        }
      )
    );

    expect(store.todoEntityMap()).toEqual({
      x: { ...todo1, completed: false },
      y: { ...todo2, completed: false },
      z: { ...todo3, completed: false },
    });
    expect(store.todoIds()).toEqual(['x', 'y', 'z']);
    expect(store.todoEntities()).toEqual([
      { ...todo1, completed: false },
      { ...todo2, completed: false },
      { ...todo3, completed: false },
    ]);

    patchState(
      store,
      updateAllEntities(({ completed }) => ({ completed: !completed }), {
        collection: 'todo',
        selectId: (todo) => todo._id,
      })
    );

    expect(store.todoEntityMap()).toEqual({
      x: { ...todo1, completed: true },
      y: { ...todo2, completed: true },
      z: { ...todo3, completed: true },
    });
    expect(store.todoIds()).toEqual(['x', 'y', 'z']);
    expect(store.todoEntities()).toEqual([
      { ...todo1, completed: true },
      { ...todo2, completed: true },
      { ...todo3, completed: true },
    ]);
  });

  it('does not modify entity state if entities do not exist in specified collection', () => {
    const Store = signalStore(
      withEntities({
        entity: type<User>(),
        collection: 'user',
      })
    );
    const store = new Store();

    const userEntityMap = store.userEntityMap();
    const userEntities = store.userEntities();
    const userIds = store.userIds();

    patchState(
      store,
      updateAllEntities({ firstName: 'Jimmy' }, { collection: 'user' }),
      updateAllEntities((user) => ({ lastName: `Hendrix${user.id}` }), {
        collection: 'user',
      })
    );

    expect(store.userEntityMap()).toBe(userEntityMap);
    expect(store.userIds()).toBe(userIds);
    expect(store.userEntities()).toBe(userEntities);

    expect(store.userEntityMap()).toEqual({});
    expect(store.userIds()).toEqual([]);
    expect(store.userEntities()).toEqual([]);
  });
});
