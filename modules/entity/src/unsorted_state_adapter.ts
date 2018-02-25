import {
  EntityState,
  EntityStateAdapter,
  IdSelector,
  SelectedId,
  SelectedIds,
  Update,
} from './models';
import { createStateOperator, DidMutate } from './state_adapter';
import 'core-js/es6/object';

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

    return DidMutate.EntitiesAndIds;
  }

  function addManyMutably(entities: T[], state: R): DidMutate;
  function addManyMutably(entities: any[], state: any): DidMutate {
    let didMutate = false;

    for (const entity of entities) {
      didMutate = addOneMutably(entity, state) !== DidMutate.None || didMutate;
    }

    return didMutate ? DidMutate.EntitiesAndIds : DidMutate.None;
  }

  function addAllMutably(entities: T[], state: R): DidMutate;
  function addAllMutably(entities: any[], state: any): DidMutate {
    state.ids = [];
    state.entities = {};

    addManyMutably(entities, state);

    return DidMutate.EntitiesAndIds;
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

    const didSelectedIdsMutate =
      didMutate && keys.some(key => state.selectedIds.has(key));

    if (didSelectedIdsMutate) {
      state.selectedIds = new Set(
        Array.from(state.selectedIds.values()).filter(
          (id: any) => !keys.includes(id)
        )
      );
      return DidMutate.All;
    }

    if (didMutate && !didSelectedIdsMutate) {
      return DidMutate.EntitiesAndIds;
    }

    return DidMutate.None;
  }

  function removeAll<S extends R>(state: S): S;
  function removeAll<S extends R>(state: any): S {
    return <S>Object.assign({}, state, {
      ids: [],
      entities: {},
      selectedIds: new Set<SelectedId>(),
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
        return DidMutate.EntitiesAndIds;
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

    for (const update of updates) {
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
      case didMutateByAdded === DidMutate.EntitiesAndIds ||
        didMutateByUpdated === DidMutate.EntitiesAndIds:
        return DidMutate.EntitiesAndIds;
      default:
        return DidMutate.EntitiesOnly;
    }
  }

  function unSelectAll(state: R): R;
  function unSelectAll(state: any): R {
    return { ...state, selectedIds: new Set<SelectedId>() };
  }

  function selectAll(state: R): R;
  function selectAll(state: any): R {
    const didMutate = state.ids.length > 0;
    if (didMutate) {
      return { ...state, selectedIds: new Set<SelectedId>(state.ids) };
    }
    return state;
  }

  function selectManyMutably(keys: SelectedIds, state: R): DidMutate;
  function selectManyMutably(keys: SelectedIds, state: any): DidMutate {
    const filteredKeys: SelectedIds = (<any>keys).filter(
      (key: SelectedId) => key in state.entities
    );
    const didMutate = filteredKeys.length > 0;
    if (didMutate) {
      const values = [...Array.from(state.selectedIds.values()), ...keys];
      state.selectedIds = new Set(values);
      return DidMutate.SelectedIdsOnly;
    }
    return DidMutate.None;
  }

  function selectOneMutably(key: SelectedId, state: R): DidMutate;
  function selectOneMutably(key: SelectedId, state: any): DidMutate {
    return selectManyMutably([key], state);
  }

  function unSelectManyMutably(keys: SelectedIds, state: R): DidMutate;
  function unSelectManyMutably(keys: SelectedIds, state: any): DidMutate {
    const filteredKeys: SelectedIds = (<any>keys).filter(
      (key: SelectedId) => key in state.entities
    );
    const someKey = filteredKeys.length > 0;
    const someIncludes = filteredKeys.some((key: SelectedId) =>
      state.selectedIds.has(key)
    );
    const didMutate = someKey && someIncludes;
    if (didMutate) {
      const filteredValues: SelectedIds = (<SelectedIds>Array.from(
        state.selectedIds.values()
      )).filter((key: SelectedId) => !filteredKeys.includes(key));
      state.selectedIds = new Set<SelectedId>(filteredValues);
      return DidMutate.SelectedIdsOnly;
    }
    return DidMutate.None;
  }

  function unSelectOneMutably(key: SelectedId, state: R): DidMutate;
  function unSelectOneMutably(key: SelectedId, state: any): DidMutate {
    return unSelectManyMutably([key], state);
  }

  function selectOnlyMutably(keys: string[], state: R): DidMutate;
  function selectOnlyMutably(keys: string[], state: any): DidMutate {
    const filteredKeys = keys.filter(key => key in state.entities);
    const didMutate = filteredKeys.length > 0;
    if (didMutate) {
      state.selectedIds = new Set(filteredKeys);
      return DidMutate.SelectedIdsOnly;
    }
    return DidMutate.None;
  }

  return {
    removeAll,
    selectAll,
    unSelectAll,
    selectOne: createStateOperator(selectOneMutably),
    selectMany: createStateOperator(selectManyMutably),
    unSelectOne: createStateOperator(unSelectOneMutably),
    unSelectMany: createStateOperator(unSelectManyMutably),
    selectOnly: createStateOperator(selectOnlyMutably),
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
