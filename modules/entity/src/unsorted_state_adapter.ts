import { EntityState, EntityStateAdapter, IdSelector, Update } from './models';
import { createStateOperator } from './state_adapter';

export function createUnsortedStateAdapter<T>(
  selectId: IdSelector<T>
): EntityStateAdapter<T>;
export function createUnsortedStateAdapter<T>(selectId: IdSelector<T>): any {
  type R = EntityState<T>;

  function addOneMutably(entity: T, state: R): boolean;
  function addOneMutably(entity: any, state: any): boolean {
    const key = selectId(entity);

    if (key in state.entities) {
      return false;
    }

    state.ids.push(key);
    state.entities[key] = entity;

    return true;
  }

  function addManyMutably(entities: T[], state: R): boolean;
  function addManyMutably(entities: any[], state: any): boolean {
    let didMutate = false;

    for (let index in entities) {
      didMutate = addOneMutably(entities[index], state) || didMutate;
    }

    return didMutate;
  }

  function addAllMutably(entities: T[], state: R): boolean;
  function addAllMutably(entities: any[], state: any): boolean {
    state.ids = [];
    state.entities = {};

    addManyMutably(entities, state);

    return true;
  }

  function removeOneMutably(key: T, state: R): boolean;
  function removeOneMutably(key: any, state: any): boolean {
    return removeManyMutably([key], state);
  }

  function removeManyMutably(keys: T[], state: R): boolean;
  function removeManyMutably(keys: any[], state: any): boolean {
    const didMutate =
      keys
        .filter(key => key in state.entities)
        .map(key => delete state.entities[key]).length > 0;

    if (didMutate) {
      state.ids = state.ids.filter((id: any) => id in state.entities);
    }

    return didMutate;
  }

  function removeAll<S extends R>(state: S): S;
  function removeAll<S extends R>(state: any): S {
    return Object.assign({}, state, {
      ids: [],
      entities: {},
    });
  }

  function takeNewKey(
    keys: { [id: string]: string },
    update: Update<T>,
    state: R
  ): void;
  function takeNewKey(
    keys: { [id: string]: any },
    update: Update<T>,
    state: any
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

  function updateOneMutably(update: Update<T>, state: R): boolean;
  function updateOneMutably(update: any, state: any): boolean {
    return updateManyMutably([update], state);
  }

  function updateManyMutably(updates: Update<T>[], state: R): boolean;
  function updateManyMutably(updates: any[], state: any): boolean {
    const newKeys: { [id: string]: string } = {};

    const didMutate =
      updates
        .filter(update => update.id in state.entities)
        .map(update => takeNewKey(newKeys, update, state)).length > 0;

    if (didMutate) {
      state.ids = state.ids.map((id: any) => newKeys[id] || id);
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
