import { PartialStateUpdater } from '@ngrx/signals';
import {
  EntityId,
  EntityIdKey,
  EntityState,
  NamedEntityState,
} from '../models';
import {
  addEntityMutably,
  cloneEntityState,
  getEntityIdKey,
  getEntityStateKeys,
  getEntityUpdaterResult,
} from '../helpers';

export function addEntity<Entity extends { id: EntityId }>(
  entity: Entity
): PartialStateUpdater<EntityState<Entity>>;
export function addEntity<
  Entity extends { id: EntityId },
  Collection extends string
>(
  entity: Entity,
  config: { collection: Collection }
): PartialStateUpdater<NamedEntityState<Entity, Collection>>;
export function addEntity<Entity>(
  entity: Entity,
  config: { idKey: EntityIdKey<Entity> }
): PartialStateUpdater<EntityState<Entity>>;
export function addEntity<Entity, Collection extends string>(
  entity: Entity,
  config: { collection: Collection; idKey: EntityIdKey<Entity> }
): PartialStateUpdater<NamedEntityState<Entity, Collection>>;
export function addEntity(
  entity: any,
  config?: { collection?: string; idKey?: string }
): PartialStateUpdater<EntityState<any>> {
  const idKey = getEntityIdKey(config);
  const stateKeys = getEntityStateKeys(config);

  return (state) => {
    const clonedState = cloneEntityState(state, stateKeys);
    const didMutate = addEntityMutably(clonedState, entity, idKey);

    return getEntityUpdaterResult(clonedState, stateKeys, didMutate);
  };
}
