import { PartialStateUpdater } from '@ngrx/signals';
import {
  EntityId,
  EntityIdKey,
  EntityState,
  NamedEntityState,
} from '../models';
import {
  cloneEntityState,
  getEntityIdKey,
  getEntityStateKeys,
  getEntityUpdaterResult,
  setEntitiesMutably,
} from '../helpers';

export function setEntities<Entity extends { id: EntityId }>(
  entities: Entity[]
): PartialStateUpdater<EntityState<Entity>>;
export function setEntities<Entity, Collection extends string>(
  entities: Entity[],
  config: { collection: Collection; idKey: EntityIdKey<Entity> }
): PartialStateUpdater<NamedEntityState<Entity, Collection>>;
export function setEntities<
  Entity extends { id: EntityId },
  Collection extends string
>(
  entities: Entity[],
  config: { collection: Collection }
): PartialStateUpdater<NamedEntityState<Entity, Collection>>;
export function setEntities<Entity>(
  entities: Entity[],
  config: { idKey: EntityIdKey<Entity> }
): PartialStateUpdater<EntityState<Entity>>;
export function setEntities(
  entities: any[],
  config?: { collection?: string; idKey?: string }
): PartialStateUpdater<EntityState<any> | NamedEntityState<any, string>> {
  const idKey = getEntityIdKey(config);
  const stateKeys = getEntityStateKeys(config);

  return (state) => {
    const clonedState = cloneEntityState(state, stateKeys);
    const didMutate = setEntitiesMutably(clonedState, entities, idKey);

    return getEntityUpdaterResult(clonedState, stateKeys, didMutate);
  };
}
