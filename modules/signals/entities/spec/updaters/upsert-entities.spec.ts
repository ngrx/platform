import { patchState, signalStore, type } from '@ngrx/signals';
import { entityConfig, upsertEntities, withEntities } from '../../src';
import { Todo, todo1, todo2, todo3, User, user1, user2, user3 } from '../mocks';
import { selectTodoId as selectId } from '../helpers';

const user1WithAge: User = {
  ...user1,
  age: 40,
};
const newUser1WithoutAge: User = {
  ...user2,
  id: user1WithAge.id,
};
const expectedUser1: User = {
  ...user2,
  id: user1WithAge.id,
  age: user1WithAge.age,
};

describe('upsertEntities', () => {
  it('adds entities if they do not exist', () => {
    const Store = signalStore({ protectedState: false }, withEntities<User>());
    const store = new Store();

    patchState(store, upsertEntities([user1]));

    expect(store.entityMap()).toEqual({ 1: user1 });
    expect(store.ids()).toEqual([1]);
    expect(store.entities()).toEqual([user1]);

    patchState(store, upsertEntities([user2, user3]));

    expect(store.entityMap()).toEqual({ 1: user1, 2: user2, 3: user3 });
    expect(store.ids()).toEqual([1, 2, 3]);
    expect(store.entities()).toEqual([user1, user2, user3]);
  });

  it('updates entities if they already exist', () => {
    const Store = signalStore({ protectedState: false }, withEntities<User>());
    const store = new Store();

    patchState(
      store,
      upsertEntities([user1WithAge, user2, { ...user2, lastName: 'Hendrix' }])
    );

    expect(store.entityMap()).toEqual({
      1: user1WithAge,
      2: { ...user2, lastName: 'Hendrix' },
    });
    expect(store.ids()).toEqual([1, 2]);
    expect(store.entities()).toEqual([
      user1WithAge,
      { ...user2, lastName: 'Hendrix' },
    ]);

    patchState(
      store,
      upsertEntities([user3, newUser1WithoutAge]),
      upsertEntities([] as User[])
    );

    expect(store.entityMap()).toEqual({
      1: expectedUser1,
      2: { ...user2, lastName: 'Hendrix' },
      3: user3,
    });
    expect(store.ids()).toEqual([1, 2, 3]);
    expect(store.entities()).toEqual([
      expectedUser1,
      { ...user2, lastName: 'Hendrix' },
      user3,
    ]);
  });

  it('adds entities to the specified collection if they do not exist', () => {
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
      upsertEntities([user1, user2], { collection: 'user' }),
      upsertEntities([user3], { collection: 'user' })
    );

    expect(store.userEntityMap()).toEqual({ 1: user1, 2: user2, 3: user3 });
    expect(store.userIds()).toEqual([1, 2, 3]);
    expect(store.userEntities()).toEqual([user1, user2, user3]);
  });

  it('updates entities to the specified collection if they already exist', () => {
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
      upsertEntities([user1WithAge, user3, newUser1WithoutAge], {
        collection: 'user',
      })
    );

    patchState(
      store,
      upsertEntities([] as User[], { collection: 'user' }),
      upsertEntities([user3, user2, { ...user3, firstName: 'Jimmy' }], {
        collection: 'user',
      })
    );

    expect(store.userEntityMap()).toEqual({
      1: expectedUser1,
      3: { ...user3, firstName: 'Jimmy' },
      2: user2,
    });
    expect(store.userIds()).toEqual([1, 3, 2]);
    expect(store.userEntities()).toEqual([
      expectedUser1,
      { ...user3, firstName: 'Jimmy' },
      user2,
    ]);
  });

  it('adds entities with a custom id if they do not exist', () => {
    const Store = signalStore({ protectedState: false }, withEntities<Todo>());
    const store = new Store();

    patchState(store, upsertEntities([todo2, todo3], { selectId }));

    expect(store.entityMap()).toEqual({ y: todo2, z: todo3 });
    expect(store.ids()).toEqual(['y', 'z']);
    expect(store.entities()).toEqual([todo2, todo3]);

    patchState(
      store,
      upsertEntities([todo1], { selectId }),
      upsertEntities([] as Todo[], { selectId })
    );

    expect(store.entityMap()).toEqual({ y: todo2, z: todo3, x: todo1 });
    expect(store.ids()).toEqual(['y', 'z', 'x']);
    expect(store.entities()).toEqual([todo2, todo3, todo1]);
  });

  it('updates entities with a custom id if they already exist', () => {
    const Store = signalStore({ protectedState: false }, withEntities<Todo>());
    const store = new Store();

    patchState(
      store,
      upsertEntities([todo1], { selectId }),
      upsertEntities([todo2, { ...todo1, text: 'Signals' }], { selectId }),
      upsertEntities([] as Todo[], { selectId })
    );

    patchState(
      store,
      upsertEntities([] as Todo[], { selectId }),
      upsertEntities([todo3, todo2, { ...todo2, text: 'NgRx' }, todo1], {
        selectId,
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

  it('adds entities with a custom id to the specified collection if they do not exist', () => {
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
      upsertEntities([todo3, todo2], {
        collection: 'todo',
        selectId,
      })
    );

    expect(store.todoEntityMap()).toEqual({ z: todo3, y: todo2 });
    expect(store.todoIds()).toEqual(['z', 'y']);
    expect(store.todoEntities()).toEqual([todo3, todo2]);

    patchState(
      store,
      upsertEntities([todo1], { collection: 'todo', selectId }),
      upsertEntities([] as Todo[], { collection: 'todo', selectId })
    );

    expect(store.todoEntityMap()).toEqual({ z: todo3, y: todo2, x: todo1 });
    expect(store.todoIds()).toEqual(['z', 'y', 'x']);
    expect(store.todoEntities()).toEqual([todo3, todo2, todo1]);
  });

  it('updates entities with a custom id to the specified collection if they already exist', () => {
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
      upsertEntities(
        [todo2, { ...todo2, text: 'NgRx' }, todo3, todo2],
        todoConfig
      ),
      upsertEntities([] as Todo[], todoConfig),
      upsertEntities([todo3, { ...todo3, text: 'NgRx' }, todo1], todoConfig)
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
