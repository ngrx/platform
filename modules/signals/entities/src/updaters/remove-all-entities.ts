import { PartialStateUpdater } from '@ngrx/signals';
import { EntityState, NamedEntityState } from '../models';
import { getEntityStateKeys } from '../helpers';

export function removeAllEntities(): PartialStateUpdater<EntityState<any>>;
export function removeAllEntities<Collection extends string>(config: {
  collection: Collection;
}): PartialStateUpdater<NamedEntityState<any, Collection>>;
/**
 * @description
 *
 * Removes all entities from the collection.
 *
 * @usageNotes
 *
 * ```ts
 * import { patchState } from '@ngrx/signals';
 * import { removeAllEntities } from '@ngrx/signals/entities';
 *
 * patchState(store, removeAllEntities());
 * ```
 */
export function removeAllEntities(config?: {
  collection?: string;
}): PartialStateUpdater<EntityState<any> | NamedEntityState<any, string>> {
  const stateKeys = getEntityStateKeys(config);

  return () => ({
    [stateKeys.entityMapKey]: {},
    [stateKeys.idsKey]: [],
  });
}
