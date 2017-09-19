import { EntityState, EntityStateAdapter, IdSelector, Update } from './models';
import { createStateOperator } from './state_adapter';

export function createUnsortedStateAdapter<T>(
  selectId: IdSelector<T>
): EntityStateAdapter<T> {
  type R = EntityState<T>;

  function addOneMutably(entity: T, state: R): boolean {
    const key = selectId(entity);

    if (key in state.entities) {
      return false;
    }

    state.ids.push(key);
    state.entities[key] = entity;

    return true;
  }

  function addManyMutably(entities: T[], state: R): boolean {
    let didMutate = false;

    for (let index in entities) {
      didMutate = addOneMutably(entities[index], state) || didMutate;
    }

    return didMutate;
  }

  function addAllMutably(entities: T[], state: R): boolean {
    state.ids = [];
    state.entities = {};

    addManyMutably(entities, state);

    return true;
  }

  function removeOneMutably(key: string, state: R): boolean {
    const index = state.ids.indexOf(key);

    if (index === -1) {
      return false;
    }

    state.ids.splice(index, 1);
    delete state.entities[key];

    return true;
  }

  function removeManyMutably(keys: string[], state: R): boolean {
    let didMutate = false;

    for (let index in keys) {
      didMutate = removeOneMutably(keys[index], state) || didMutate;
    }

    return didMutate;
  }

  function removeAll<S extends R>(state: S): S {
    return Object.assign({}, state, {
      ids: [],
      entities: {},
    });
  }

  function updateOneMutably(update: Update<T>, state: R): boolean {
    const index = state.ids.indexOf(update.id);

    if (index === -1) {
      return false;
    }

    const original = state.entities[update.id];
    const updated: T = Object.assign({}, original, update.changes);
    const newKey = selectId(updated);

    if (newKey !== update.id) {
      state.ids[index] = newKey;
      delete state.entities[update.id];
    }

    state.entities[newKey] = updated;

    return true;
  }

  function updateManyMutably(updates: Update<T>[], state: R): boolean {
    let didMutate = false;

    for (let index in updates) {
      didMutate = updateOneMutably(updates[index], state) || didMutate;
    }

    return didMutate;
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
