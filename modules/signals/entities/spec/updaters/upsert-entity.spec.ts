import { patchState, signalStore, type } from '@ngrx/signals';
import { entityConfig, upsertEntity, withEntities } from '../../src';
import { Todo, todo1, todo2, User, user1, user2, user3 } from '../mocks';
import { selectTodoId as selectId } from '../helpers';

const user2WithAge: User = {
  ...user2,
  age: 30,
};
const newUser2WithoutAge: User = {
  ...user3,
  id: user2WithAge.id,
};
const expectedUser2: User = {
  ...user3,
  id: user2WithAge.id,
  age: user2WithAge.age,
};

describe('upsertEntity', () => {
  it('adds entity if it does not exist', () => {
    const Store = signalStore({ protectedState: false }, withEntities<User>());
    const store = new Store();

    patchState(store, upsertEntity(user1));

    expect(store.entityMap()).toEqual({ 1: user1 });
    expect(store.ids()).toEqual([1]);
    expect(store.entities()).toEqual([user1]);

    patchState(store, upsertEntity(user2));

    expect(store.entityMap()).toEqual({ 1: user1, 2: user2 });
    expect(store.ids()).toEqual([1, 2]);
    expect(store.entities()).toEqual([user1, user2]);
  });

  it('updates entity if it already exists', () => {
    const Store = signalStore({ protectedState: false }, withEntities<User>());
    const store = new Store();

    patchState(store, upsertEntity(user1), upsertEntity(user2WithAge));
    patchState(store, upsertEntity(newUser2WithoutAge));

    expect(store.entityMap()).toEqual({
      1: user1,
      2: expectedUser2,
    });
    expect(store.ids()).toEqual([1, 2]);
    expect(store.entities()).toEqual([user1, expectedUser2]);
  });

  it('adds entity to the specified collection if it does not exist', () => {
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
      upsertEntity(user1, { collection: 'user' }),
      upsertEntity(user2, { collection: 'user' })
    );

    expect(store.userEntityMap()).toEqual({ 1: user1, 2: user2 });
    expect(store.userIds()).toEqual([1, 2]);
    expect(store.userEntities()).toEqual([user1, user2]);
  });

  it('updates entity to the specified collection if it already exists', () => {
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
      upsertEntity(user1, { collection: 'user' }),
      upsertEntity(user2WithAge, { collection: 'user' }),
      upsertEntity({ ...user1, firstName: 'Jimmy' }, { collection: 'user' }),
      upsertEntity(user3, { collection: 'user' }),
      upsertEntity(newUser2WithoutAge, { collection: 'user' })
    );

    expect(store.userEntityMap()).toEqual({
      1: { ...user1, firstName: 'Jimmy' },
      2: expectedUser2,
      3: user3,
    });
    expect(store.userIds()).toEqual([1, 2, 3]);
    expect(store.userEntities()).toEqual([
      { ...user1, firstName: 'Jimmy' },
      expectedUser2,
      user3,
    ]);
  });

  it('adds entity with a custom id if it does not exist', () => {
    const Store = signalStore({ protectedState: false }, withEntities<Todo>());
    const store = new Store();

    patchState(store, upsertEntity(todo1, { selectId }));

    expect(store.entityMap()).toEqual({ x: todo1 });
    expect(store.ids()).toEqual(['x']);
    expect(store.entities()).toEqual([todo1]);

    patchState(store, upsertEntity(todo2, { selectId }));

    expect(store.entityMap()).toEqual({ x: todo1, y: todo2 });
    expect(store.ids()).toEqual(['x', 'y']);
    expect(store.entities()).toEqual([todo1, todo2]);
  });

  it('updates entity with a custom id if it already exists', () => {
    const Store = signalStore({ protectedState: false }, withEntities<Todo>());
    const store = new Store();

    patchState(
      store,
      upsertEntity(todo1, { selectId }),
      upsertEntity(todo2, { selectId })
    );
    patchState(store, upsertEntity({ ...todo2, text: 'NgRx' }, { selectId }));

    expect(store.entityMap()).toEqual({
      x: todo1,
      y: { ...todo2, text: 'NgRx' },
    });
    expect(store.ids()).toEqual(['x', 'y']);
    expect(store.entities()).toEqual([todo1, { ...todo2, text: 'NgRx' }]);
  });

  it('adds entity with a custom id to the specified collection if it does not exist', () => {
    const Store = signalStore(
      { protectedState: false },
      withEntities({
        entity: type<Todo>(),
        collection: 'todo',
      })
    );
    const store = new Store();

    patchState(store, upsertEntity(todo1, { collection: 'todo', selectId }));

    expect(store.todoEntityMap()).toEqual({ x: todo1 });
    expect(store.todoIds()).toEqual(['x']);
    expect(store.todoEntities()).toEqual([todo1]);

    patchState(store, upsertEntity(todo2, { collection: 'todo', selectId }));

    expect(store.todoEntityMap()).toEqual({ x: todo1, y: todo2 });
    expect(store.todoIds()).toEqual(['x', 'y']);
    expect(store.todoEntities()).toEqual([todo1, todo2]);
  });

  it('updates entity with a custom id to the specified collection if it already exists', () => {
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
      upsertEntity(todo1, todoConfig),
      upsertEntity(todo2, todoConfig)
    );
    patchState(
      store,
      upsertEntity({ ...todo2, text: 'Signals' }, todoConfig),
      upsertEntity(todo1, todoConfig),
      upsertEntity({ ...todo1, text: 'NgRx' }, todoConfig),
      upsertEntity(todo2, todoConfig)
    );

    expect(store.todoEntityMap()).toEqual({
      x: { ...todo1, text: 'NgRx' },
      y: todo2,
    });
    expect(store.todoIds()).toEqual(['x', 'y']);
    expect(store.todoEntities()).toEqual([{ ...todo1, text: 'NgRx' }, todo2]);
  });
});
