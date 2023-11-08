import { PartialStateUpdater } from '@ngrx/signals';
import {
  EntityId,
  EntityIdKey,
  EntityState,
  NamedEntityState,
} from '../models';
import {
  getEntityIdKey,
  getEntityStateKeys,
  setEntitiesMutably,
} from '../helpers';

export function setAllEntities<Entity extends { id: EntityId }>(
  entities: Entity[]
): PartialStateUpdater<EntityState<Entity>>;
export function setAllEntities<Entity, Collection extends string>(
  entities: Entity[],
  config: { collection: Collection; idKey: EntityIdKey<Entity> }
): PartialStateUpdater<NamedEntityState<Entity, Collection>>;
export function setAllEntities<
  Entity extends { id: EntityId },
  Collection extends string
>(
  entities: Entity[],
  config: { collection: Collection }
): PartialStateUpdater<NamedEntityState<Entity, Collection>>;
export function setAllEntities<Entity>(
  entities: Entity[],
  config: { idKey: EntityIdKey<Entity> }
): PartialStateUpdater<EntityState<Entity>>;
export function setAllEntities(
  entities: any[],
  config?: { collection?: string; idKey?: string }
): PartialStateUpdater<EntityState<any> | NamedEntityState<any, string>> {
  const idKey = getEntityIdKey(config);
  const stateKeys = getEntityStateKeys(config);

  return () => {
    const state: EntityState<any> = { entityMap: {}, ids: [] };
    setEntitiesMutably(state, entities, idKey);

    return {
      [stateKeys.entityMapKey]: state.entityMap,
      [stateKeys.idsKey]: state.ids,
    };
  };
}
