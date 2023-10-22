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
  setEntityMutably,
} from '../helpers';

export function setEntity<Entity extends { id: EntityId }>(
  entity: Entity
): PartialStateUpdater<EntityState<Entity>>;
export function setEntity<
  Entity extends { id: EntityId },
  Collection extends string
>(
  entity: Entity,
  config: { collection: Collection }
): PartialStateUpdater<NamedEntityState<Entity, Collection>>;
export function setEntity<Entity>(
  entity: Entity,
  config: { idKey: EntityIdKey<Entity> }
): PartialStateUpdater<EntityState<Entity>>;
export function setEntity<Entity, Collection extends string>(
  entity: Entity,
  config: { collection: Collection; idKey: EntityIdKey<Entity> }
): PartialStateUpdater<NamedEntityState<Entity, Collection>>;
export function setEntity(
  entity: any,
  config?: { collection?: string; idKey?: string }
): PartialStateUpdater<EntityState<any>> {
  const idKey = getEntityIdKey(config);
  const stateKeys = getEntityStateKeys(config);

  return (state) => {
    const clonedState = cloneEntityState(state, stateKeys);
    const didMutate = setEntityMutably(clonedState, entity, idKey);

    return getEntityUpdaterResult(clonedState, stateKeys, didMutate);
  };
}
