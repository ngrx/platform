import { EntityState, EntityStateAdapter, IdSelector, Update } from './models';
import { createStateOperator } from './state_adapter';

export function createUnsortedStateAdapter<T>(
  selectId: IdSelector<T>
): EntityStateAdapter<T> {
  type R = EntityState<T>;

  function addOneMutably(entity: T, state: R): void {
    const key = selectId(entity);
    const index = state.ids.indexOf(key);

    if (index !== -1) {
      return;
    }

    state.ids.push(key);
    state.entities[key] = entity;
  }

  function addManyMutably(entities: T[], state: R): void {
    for (let index in entities) {
      addOneMutably(entities[index], state);
    }
  }

  function addAllMutably(entities: T[], state: R): void {
    state.ids = [];
    state.entities = {};

    addManyMutably(entities, state);
  }

  function removeOneMutably(key: string, state: R): void {
    const index = state.ids.indexOf(key);

    if (index === -1) {
      return;
    }

    state.ids.splice(index, 1);
    delete state.entities[key];
  }

  function removeManyMutably(keys: string[], state: R): void {
    for (let index in keys) {
      removeOneMutably(keys[index], state);
    }
  }

  function removeAll<S extends R>(state: S): S {
    return Object.assign({}, state, {
      ids: [],
      entities: {},
    });
  }

  function updateOneMutably(update: Update<T>, state: R): void {
    const index = state.ids.indexOf(update.id);

    if (index === -1) {
      return;
    }

    const original = state.entities[update.id];
    const updated: T = Object.assign({}, original, update.changes);
    const newKey = selectId(updated);

    if (newKey !== update.id) {
      state.ids[index] = newKey;
      delete state.entities[update.id];
    }

    state.entities[newKey] = updated;
  }

  function updateManyMutably(updates: Update<T>[], state: R): void {
    for (let index in updates) {
      updateOneMutably(updates[index], state);
    }
  }

  return {
    removeAll,
    addOne: createStateOperator(addOneMutably),
    addMany: createStateOperator(addManyMutably),
    addAll: createStateOperator(addAllMutably),
    updateOne: createStateOperator(updateOneMutably),
    updateMany: createStateOperator(updateManyMutably),
    removeOne: createStateOperator(removeOneMutably),
    removeMany: createStateOperator(removeManyMutably),
  };
}
