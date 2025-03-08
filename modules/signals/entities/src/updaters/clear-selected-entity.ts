import { PartialStateUpdater } from '@ngrx/signals';
import { NamedEntityState, EntityState } from '../models';
import { getEntityStateKeys } from '../helpers';

/**
 * Sets the selected entity and the selected id to null.
 */
export function clearSelectedEntity(): PartialStateUpdater<EntityState<any>>;
export function clearSelectedEntity<Collection extends string>(config: {
  collection: Collection;
}): PartialStateUpdater<NamedEntityState<any, Collection>>;
export function clearSelectedEntity(config?: {
  collection?: string;
}): PartialStateUpdater<EntityState<any> | NamedEntityState<any, string>> {
  const { selectedEntityIdKey } = getEntityStateKeys(config);

  return () => {
    return { [selectedEntityIdKey]: null };
  };
}
