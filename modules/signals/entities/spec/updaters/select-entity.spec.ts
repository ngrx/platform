import { patchState, signalStore, type } from '@ngrx/signals';
import {
  addEntities,
  addEntity,
  withEntities,
  selectEntity,
  setEntities,
} from '../../src';
import { Todo, todo1, todo2, todo3, User, user1, user2, user3 } from '../mocks';

describe('selectEntity', () => {
  it('should select an entity and return it if exists', () => {
    const Store = signalStore({ protectedState: false }, withEntities<User>());
    const store = new Store();

    patchState(store, addEntities([user1, user2, user3]));
    patchState(store, selectEntity(user1.id));

    expect(store.selectedId()).toBe(user1.id);
    expect(store.selectedEntity()).toBe(user1);
  });

  it('should select an entity and return null if it does not exists', () => {
    const Store = signalStore({ protectedState: false }, withEntities<User>());
    const store = new Store();

    patchState(store, addEntities([user1, user2]));
    patchState(store, selectEntity(user3.id));

    expect(store.selectedId()).toBe(user3.id);
    expect(store.selectedEntity()).toBe(null);
  });

  it('should return null if the selected entity does not exist and return the entity as soon as it is added to the state', () => {
    const Store = signalStore({ protectedState: false }, withEntities<User>());
    const store = new Store();

    patchState(store, addEntities([user1, user2]));
    patchState(store, selectEntity(user3.id));

    expect(store.selectedId()).toBe(user3.id);
    expect(store.selectedEntity()).toBe(null);

    patchState(store, addEntity(user3));

    expect(store.selectedId()).toBe(user3.id);
    expect(store.selectedEntity()).toBe(user3);
  });
});
