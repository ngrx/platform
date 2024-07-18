import { patchState, signalStore, type } from '@ngrx/signals';
import { removeAllEntities, setAllEntities, withEntities } from '../../src';
import { Todo, todo1, todo2, User, user1, user2 } from '../mocks';
import { selectTodoId } from '../helpers';

describe('removeAllEntities', () => {
  it('removes all entities', () => {
    const Store = signalStore({ protectedState: false }, withEntities<User>());
    const store = new Store();

    patchState(store, setAllEntities([user1, user2]), removeAllEntities());

    expect(store.entityMap()).toEqual({});
    expect(store.ids()).toEqual([]);
    expect(store.entities()).toEqual([]);
  });

  it('removes all entities from specified entity collection', () => {
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
      setAllEntities([todo1, todo2], {
        collection: 'todo',
        selectId: selectTodoId,
      })
    );
    patchState(store, removeAllEntities({ collection: 'todo' }));

    expect(store.todoEntityMap()).toEqual({});
    expect(store.todoIds()).toEqual([]);
    expect(store.todoEntities()).toEqual([]);
  });
});
