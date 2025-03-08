import { patchState, signalStore } from '@ngrx/signals';
import {
  addEntities,
  withEntities,
  selectEntity,
  clearSelectedEntity,
} from '../../src';
import { User, user1, user2, user3 } from '../mocks';

describe('selectEntity', () => {
  it('should clear the selectedEntity and selectedEntityId if an entity is selected and exists in the state', () => {
    const Store = signalStore({ protectedState: false }, withEntities<User>());
    const store = new Store();

    patchState(store, addEntities([user1, user2, user3]));
    patchState(store, selectEntity(user1.id));

    expect(store.selectedId()).toBe(user1.id);
    expect(store.selectedEntity()).toBe(user1);

    patchState(store, clearSelectedEntity());

    expect(store.selectedId()).toBe(null);
    expect(store.selectedEntity()).toBe(null);
  });

  it('should clear the selectedEntity and selectedEntityId if an entity is selected and it does not exists in the state', () => {
    const Store = signalStore({ protectedState: false }, withEntities<User>());
    const store = new Store();

    patchState(store, addEntities([user1, user2]));
    patchState(store, selectEntity(user3.id));

    expect(store.selectedId()).toBe(user3.id);
    expect(store.selectedEntity()).toBe(null);

    patchState(store, clearSelectedEntity());

    expect(store.selectedId()).toBe(null);
    expect(store.selectedEntity()).toBe(null);
  });

  it('should not change the state if an entity is not selected', () => {
    const Store = signalStore({ protectedState: false }, withEntities<User>());
    const store = new Store();

    patchState(store, addEntities([user1, user2, user3]));

    expect(store.selectedId()).toBe(null);
    expect(store.selectedEntity()).toBe(null);

    patchState(store, clearSelectedEntity());

    expect(store.selectedId()).toBe(null);
    expect(store.selectedEntity()).toBe(null);
  });
});
