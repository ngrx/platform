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

  function addOneMutably(entity: T, state: R): void {
    const key = selectId(entity);
    const index = state.ids.indexOf(key);

    if (index !== -1) {
      return;
    }

    const insertAt = findTargetIndex(state, entity);
    state.ids.splice(insertAt, 0, key);
    state.entities[key] = entity;
  }

  function addManyMutably(newModels: T[], state: R): void {
    for (let index in newModels) {
      addOneMutably(newModels[index], state);
    }
  }

  function addAllMutably(models: T[], state: R): void {
    const sortedModels = models.sort(sort);

    state.entities = {};
    state.ids = sortedModels.map(model => {
      const id = selectId(model);
      state.entities[id] = model;
      return id;
    });
  }

  function updateOneMutably(update: Update<T>, state: R): void {
    const index = state.ids.indexOf(update.id);

    if (index === -1) {
      return;
    }

    const original = state.entities[update.id];
    const updated: T = Object.assign({}, original, update.changes);
    const updatedKey = selectId(updated);
    const result = sort(original, updated);

    if (result === 0) {
      if (updatedKey !== update.id) {
        delete state.entities[update.id];
        state.ids[index] = updatedKey;
      }

      state.entities[updatedKey] = updated;

      return;
    }

    state.ids.splice(index, 1);
    state.ids.splice(findTargetIndex(state, updated), 0, updatedKey);

    if (updatedKey !== update.id) {
      delete state.entities[update.id];
    }

    state.entities[updatedKey] = updated;
  }

  function updateManyMutably(updates: Update<T>[], state: R): void {
    for (let index in updates) {
      updateOneMutably(updates[index], state);
    }
  }

  function findTargetIndex(
    state: R,
    model: T,
    left = 0,
    right = state.ids.length - 1
  ) {
    if (right === -1) {
      return 0;
    }

    let middle: number;

    while (true) {
      middle = Math.floor((left + right) / 2);

      const result = sort(state.entities[state.ids[middle]], model);

      if (result === 0) {
        return middle;
      } else if (result < 0) {
        left = middle + 1;
      } else {
        right = middle - 1;
      }

      if (left > right) {
        return state.ids.length - 1;
      }
    }
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
