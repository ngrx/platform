import {
  EntityState,
  IdSelector,
  Comparer,
  Dictionary,
  EntityStateAdapter,
  Update,
} from './models';
import { createStateOperator } from './state_adapter';
import { createUnsortedStateAdapter } from './unsorted_state_adapter';

export function createSortedStateAdapter<T>(
  selectId: IdSelector<T>,
  sort: Comparer<T>
): EntityStateAdapter<T> {
  type R = EntityState<T>;

  const { removeOne, removeMany, removeAll } = createUnsortedStateAdapter(
    selectId
  );

  function addOneMutably(entity: T, state: R): boolean {
    const key = selectId(entity);

    if (key in state.entities) {
      return false;
    }

    const insertAt = findTargetIndex(state, entity);
    state.ids.splice(insertAt, 0, key);
    state.entities[key] = entity;

    return true;
  }

  function addManyMutably(newModels: T[], state: R): boolean {
    let didMutate = false;

    for (let index in newModels) {
      didMutate = addOneMutably(newModels[index], state) || didMutate;
    }

    return didMutate;
  }

  function addAllMutably(models: T[], state: R): boolean {
    const sortedModels = models.sort(sort);

    state.entities = {};
    state.ids = sortedModels.map(model => {
      const id = selectId(model);
      state.entities[id] = model;
      return id;
    });

    return true;
  }

  function updateOneMutably(update: Update<T>, state: R): boolean {
    if (!(update.id in state.entities)) {
      return false;
    }

    const original = state.entities[update.id];
    const updated: T = Object.assign({}, original, update.changes);
    const updatedKey = selectId(updated);
    const result = sort(original, updated);

    if (result === 0) {
      if (updatedKey !== update.id) {
        delete state.entities[update.id];
        const index = state.ids.indexOf(update.id);
        state.ids[index] = updatedKey;
      }

      state.entities[updatedKey] = updated;

      return true;
    }

    const index = state.ids.indexOf(update.id);
    state.ids.splice(index, 1);
    state.ids.splice(findTargetIndex(state, updated), 0, updatedKey);

    if (updatedKey !== update.id) {
      delete state.entities[update.id];
    }

    state.entities[updatedKey] = updated;

    return true;
  }

  function updateManyMutably(updates: Update<T>[], state: R): boolean {
    let didMutate = false;

    for (let index in updates) {
      didMutate = updateOneMutably(updates[index], state) || didMutate;
    }

    return didMutate;
  }

  function findTargetIndex(state: R, model: T) {
    if (state.ids.length === 0) {
      return 0;
    }

    for (let i = 0; i < state.ids.length; i++) {
      const entity = state.entities[state.ids[i]];
      const isSmaller = sort(model, entity) < 0;

      if (isSmaller) {
        return i;
      }
    }

    return state.ids.length - 1;
  }

  return {
    removeOne,
    removeMany,
    removeAll,
    addOne: createStateOperator(addOneMutably),
    updateOne: createStateOperator(updateOneMutably),
    addAll: createStateOperator(addAllMutably),
    addMany: createStateOperator(addManyMutably),
    updateMany: createStateOperator(updateManyMutably),
  };
}
