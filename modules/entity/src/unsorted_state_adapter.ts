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
    return removeManyMutably([key], state);
  }

  function removeManyMutably(keys: string[], state: R): boolean {
    const didMutate =
      keys
        .filter(key => key in state.entities)
        .map(key => delete state.entities[key]).length > 0;

    if (didMutate) {
      state.ids = state.ids.filter(id => id in state.entities);
    }

    return didMutate;
  }

  function removeAll<S extends R>(state: S): S {
    return Object.assign({}, state, {
      ids: [],
      entities: {},
    });
  }

  function takeNewKey(
    keys: { [id: string]: string },
    update: Update<T>,
    state: R
  ): void {
    const original = state.entities[update.id];
    const updated: T = Object.assign({}, original, update.changes);
    const newKey = selectId(updated);

    if (newKey !== update.id) {
      keys[update.id] = newKey;
      delete state.entities[update.id];
    }

    state.entities[newKey] = updated;
  }

  function updateOneMutably(update: Update<T>, state: R): boolean {
    return updateManyMutably([update], state);
  }

  function updateManyMutably(updates: Update<T>[], state: R): boolean {
    const newKeys: { [id: string]: string } = {};

    const didMutate =
      updates
        .filter(update => update.id in state.entities)
        .map(update => takeNewKey(newKeys, update, state)).length > 0;

    if (didMutate) {
      state.ids = state.ids.map(id => newKeys[id] || id);
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
