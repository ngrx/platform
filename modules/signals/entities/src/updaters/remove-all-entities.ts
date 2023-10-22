import { PartialStateUpdater } from '@ngrx/signals';
import { EntityState, NamedEntityState } from '../models';
import { getEntityStateKeys } from '../helpers';

export function removeAllEntities(): PartialStateUpdater<EntityState<any>>;
export function removeAllEntities<Collection extends string>(config: {
  collection: Collection;
}): PartialStateUpdater<NamedEntityState<any, Collection>>;
export function removeAllEntities(config?: {
  collection?: string;
}): PartialStateUpdater<EntityState<any> | NamedEntityState<any, string>> {
  const stateKeys = getEntityStateKeys(config);

  return () => ({
    [stateKeys.entityMapKey]: {},
    [stateKeys.idsKey]: [],
  });
}
