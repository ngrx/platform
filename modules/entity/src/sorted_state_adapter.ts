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
    return addManyMutably([entity], state);
  }

  function addManyMutably(newModels: T[], state: R): boolean {
    const models = newModels.filter(
      model => !(selectId(model) in state.entities)
    );

    return merge(models, state);
  }

  function addAllMutably(models: T[], state: R): boolean {
    state.entities = {};
    state.ids = [];

    addManyMutably(models, state);

    return true;
  }

  function updateOneMutably(update: Update<T>, state: R): boolean {
    return updateManyMutably([update], state);
  }

  function takeUpdatedModel(models: T[], update: Update<T>, state: R): void {
    if (!(update.id in state.entities)) {
      return;
    }

    const original = state.entities[update.id];
    const updated = Object.assign({}, original, update.changes);

    delete state.entities[update.id];

    models.push(updated);
  }

  function updateManyMutably(updates: Update<T>[], state: R): boolean {
    const models: T[] = [];

    updates.forEach(update => takeUpdatedModel(models, update, state));

    if (models.length) {
      state.ids = state.ids.filter(id => id in state.entities);
    }

    return merge(models, state);
  }

  function merge(models: T[], state: R): boolean {
    if (models.length === 0) {
      return false;
    }

    models.sort(sort);

    const ids: string[] = [];

    let i = 0;
    let j = 0;

    while (i < models.length && j < state.ids.length) {
      const model = models[i];
      const modelId = selectId(model);
      const entityId = state.ids[j];
      const entity = state.entities[entityId];

      if (sort(model, entity) <= 0) {
        ids.push(modelId);
        i++;
      } else {
        ids.push(entityId);
        j++;
      }
    }

    if (i < models.length) {
      state.ids = ids.concat(models.slice(i).map(selectId));
    } else {
      state.ids = ids.concat(state.ids.slice(j));
    }

    models.forEach((model, i) => {
      state.entities[selectId(model)] = model;
    });

    return true;
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
