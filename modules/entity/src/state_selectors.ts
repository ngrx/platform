import { createSelector } from '@ngrx/store';
import {
  EntityState,
  EntitySelectors,
  Dictionary,
  MemoizedEntitySelectors,
} from './models';

export function createSelectorsFactory<T>() {
  function getSelectors(): EntitySelectors<T, EntityState<T>>;
  function getSelectors<V>(
    selectState: (state: V) => EntityState<T>
  ): MemoizedEntitySelectors<T, V>;
  function getSelectors<V>(
    selectState?: (state: V) => EntityState<T>
  ): EntitySelectors<T, EntityState<T>> | MemoizedEntitySelectors<T, V> {
    const selectIds = (state: EntityState<T>) => state.ids;
    const selectEntities = (state: EntityState<T>) => state.entities;
    const selectAll = createSelector(
      selectIds,
      selectEntities,
      (ids: (string | number)[], entities: Dictionary<T>): T[] =>
        ids.map((id) => entities[id] as T)
    );

    const selectTotal = createSelector(selectIds, (ids) => ids.length);

    if (!selectState) {
      return {
        selectIds,
        selectEntities,
        selectAll,
        selectTotal,
      };
    }

    return {
      selectIds: createSelector(selectState, selectIds),
      selectEntities: createSelector(selectState, selectEntities),
      selectAll: createSelector(selectState, selectAll),
      selectTotal: createSelector(selectState, selectTotal),
    };
  }

  return { getSelectors };
}
