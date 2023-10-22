import { PartialStateUpdater } from '@ngrx/signals';
import {
  EntityId,
  EntityIdKey,
  EntityState,
  NamedEntityState,
} from '../models';
import {
  addEntitiesMutably,
  cloneEntityState,
  getEntityIdKey,
  getEntityStateKeys,
  getEntityUpdaterResult,
} from '../helpers';

export function addEntities<Entity extends { id: EntityId }>(
  entities: Entity[]
): PartialStateUpdater<EntityState<Entity>>;
export function addEntities<
  Entity extends { id: EntityId },
  Collection extends string
>(
  entities: Entity[],
  config: { collection: Collection }
): PartialStateUpdater<NamedEntityState<Entity, Collection>>;
export function addEntities<Entity>(
  entities: Entity[],
  config: { idKey: EntityIdKey<Entity> }
): PartialStateUpdater<EntityState<Entity>>;
export function addEntities<Entity, Collection extends string>(
  entities: Entity[],
  config: { collection: Collection; idKey: EntityIdKey<Entity> }
): PartialStateUpdater<NamedEntityState<Entity, Collection>>;
export function addEntities(
  entities: any[],
  config?: { collection?: string; idKey?: string }
): PartialStateUpdater<EntityState<any>> {
  const idKey = getEntityIdKey(config);
  const stateKeys = getEntityStateKeys(config);

  return (state) => {
    const clonedState = cloneEntityState(state, stateKeys);
    const didMutate = addEntitiesMutably(clonedState, entities, idKey);

    return getEntityUpdaterResult(clonedState, stateKeys, didMutate);
  };
}
