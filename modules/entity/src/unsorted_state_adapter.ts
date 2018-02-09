import { EntityState, EntityStateAdapter, IdSelector, Update } from './models';
import { createStateOperator, DidMutate } from './state_adapter';

export function createUnsortedStateAdapter<T>(
  selectId: IdSelector<T>
): EntityStateAdapter<T>;
export function createUnsortedStateAdapter<T>(selectId: IdSelector<T>): any {
  type R = EntityState<T>;

  function addOneMutably(entity: T, state: R): DidMutate;
  function addOneMutably(entity: any, state: any): DidMutate {
    const key = selectId(entity);

    if (key in state.entities) {
      return DidMutate.None;
    }

    state.ids.push(key);
    state.entities[key] = entity;

    return DidMutate.Both;
  }

  function addManyMutably(entities: T[], state: R): DidMutate;
  function addManyMutably(entities: any[], state: any): DidMutate {
    let didMutate = false;

    for (const entity of entities) {
      didMutate = addOneMutably(entity, state) !== DidMutate.None || didMutate;
    }

    return didMutate ? DidMutate.Both : DidMutate.None;
  }

  function addAllMutably(entities: T[], state: R): DidMutate;
  function addAllMutably(entities: any[], state: any): DidMutate {
    state.ids = [];
    state.entities = {};

    addManyMutably(entities, state);

    return DidMutate.Both;
  }

  function removeOneMutably(key: T, state: R): DidMutate;
  function removeOneMutably(key: any, state: any): DidMutate {
    return removeManyMutably([key], state);
  }

  function removeManyMutably(keys: T[], state: R): DidMutate;
  function removeManyMutably(keys: any[], state: any): DidMutate {
    const didMutate =
      keys
        .filter(key => key in state.entities)
        .map(key => delete state.entities[key]).length > 0;

    if (didMutate) {
      state.ids = state.ids.filter((id: any) => id in state.entities);
    }

    return didMutate ? DidMutate.Both : DidMutate.None;
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
  ): boolean {
    const original = state.entities[update.id];
    const updated: T = Object.assign({}, original, update.changes);
    const newKey = selectId(updated);
    const hasNewKey = newKey !== update.id;

    if (hasNewKey) {
      keys[update.id] = newKey;
      delete state.entities[update.id];
    }

    state.entities[newKey] = updated;

    return hasNewKey;
  }

  function updateOneMutably(update: Update<T>, state: R): DidMutate;
  function updateOneMutably(update: any, state: any): DidMutate {
    return updateManyMutably([update], state);
  }

  function updateManyMutably(updates: Update<T>[], state: R): DidMutate;
  function updateManyMutably(updates: any[], state: any): DidMutate {
    const newKeys: { [id: string]: string } = {};

    updates = updates.filter(update => update.id in state.entities);

    const didMutateEntities = updates.length > 0;

    if (didMutateEntities) {
      const didMutateIds =
        updates.filter(update => takeNewKey(newKeys, update, state)).length > 0;

      if (didMutateIds) {
        state.ids = state.ids.map((id: any) => newKeys[id] || id);
        return DidMutate.Both;
      } else {
        return DidMutate.EntitiesOnly;
      }
    }

    return DidMutate.None;
  }

  function upsertOneMutably(update: Update<T>, state: R): DidMutate;
  function upsertOneMutably(update: any, state: any): DidMutate {
    return upsertManyMutably([update], state);
  }

  function upsertManyMutably(updates: Update<T>[], state: R): DidMutate;
  function upsertManyMutably(updates: any[], state: any): DidMutate {
    const added: T[] = [];
    const updated: any[] = [];

    for (let index in updates) {
      const update = updates[index];
      if (update.id in state.entities) {
        updated.push(update);
      } else {
        added.push({
          ...update.changes,
          id: update.id,
        });
      }
    }

    const didMutateByUpdated = updateManyMutably(updated, state);
    const didMutateByAdded = addManyMutably(added, state);

    switch (true) {
      case didMutateByAdded === DidMutate.None &&
        didMutateByUpdated === DidMutate.None:
        return DidMutate.None;
      case didMutateByAdded === DidMutate.Both ||
        didMutateByUpdated === DidMutate.Both:
        return DidMutate.Both;
      default:
        return DidMutate.EntitiesOnly;
    }
  }

  return {
    removeAll,
    addOne: createStateOperator(addOneMutably),
    addMany: createStateOperator(addManyMutably),
    addAll: createStateOperator(addAllMutably),
    updateOne: createStateOperator(updateOneMutably),
    updateMany: createStateOperator(updateManyMutably),
    upsertOne: createStateOperator(upsertOneMutably),
    upsertMany: createStateOperator(upsertManyMutably),
    removeOne: createStateOperator(removeOneMutably),
    removeMany: createStateOperator(removeManyMutably),
  };
}
