import { PartialStateUpdater } from '@ngrx/signals';
import { EntityId, EntityState, NamedEntityState } from '../models';
import { getEntityStateKeys } from '../helpers';

export function removeAllEntities(): PartialStateUpdater<EntityState<any, any>>;
export function removeAllEntities<Collection extends string>(config: {
  collection: Collection;
}): PartialStateUpdater<NamedEntityState<any, Collection, any>>;
export function removeAllEntities(config?: {
  collection?: string;
}): PartialStateUpdater<
  EntityState<any, EntityId> | NamedEntityState<any, string, EntityId>
> {
  const stateKeys = getEntityStateKeys(config);

  return () => ({
    [stateKeys.entityMapKey]: {},
    [stateKeys.idsKey]: [],
  });
}
