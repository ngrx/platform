import { PartialStateUpdater } from '@ngrx/signals';
import { getEntityStateKeys } from '../helpers';
import { EntityState, EntityId, NamedEntityState } from '../models';

/**
 * Selects an entity by its id.
 *
 * Note: It does not throw any error if the entity does not exists it will simply return null on the selectedEntity property.
 */
export function selectEntity(
  id: EntityId
): PartialStateUpdater<EntityState<any>>;
export function selectEntity<Collection extends string>(
  id: EntityId,
  config: { collection: Collection }
): PartialStateUpdater<NamedEntityState<any, Collection>>;
export function selectEntity(
  id: EntityId,
  config?: { collection?: string }
): PartialStateUpdater<EntityState<any> | NamedEntityState<any, string>> {
  const { selectedEntityIdKey } = getEntityStateKeys(config);

  return () => {
    return { [selectedEntityIdKey]: id };
  };
}
