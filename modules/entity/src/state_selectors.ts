import { createSelector } from '@ngrx/store';
import { EntityState, EntitySelectors, Dictionary } from './models';

export function createSelectorsFactory<T>() {
  return {
    getSelectors<V>(
      selectState: (state: V) => EntityState<T>
    ): EntitySelectors<T, V> {
      const selectIds = (state: any) => state.ids;
      const selectEntities = (state: EntityState<T>) => state.entities;
      const selectAll = createSelector(
        selectIds,
        selectEntities,
        (ids: T[], entities: Dictionary<T>): any =>
          ids.map((id: any) => (entities as any)[id])
      );

      const selectTotal = createSelector(selectIds, ids => ids.length);

      return {
        selectIds: createSelector(selectState, selectIds),
        selectEntities: createSelector(selectState, selectEntities),
        selectAll: createSelector(selectState, selectAll),
        selectTotal: createSelector(selectState, selectTotal),
      };
    },
  };
}
