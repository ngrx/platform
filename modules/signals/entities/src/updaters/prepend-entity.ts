import { PartialStateUpdater } from '@ngrx/signals';
import {
  EntityId,
  EntityState,
  NamedEntityState,
  SelectEntityId,
} from '../models';
import {
  addEntityMutably,
  cloneEntityState,
  getEntityIdSelector,
  getEntityStateKeys,
  getEntityUpdaterResult,
} from '../helpers';

export function prependEntity<Entity extends { id: EntityId }>(
  entity: Entity
): PartialStateUpdater<EntityState<Entity>>;
export function prependEntity<Entity, Collection extends string>(
  entity: Entity,
  config: { collection: Collection; selectId: SelectEntityId<NoInfer<Entity>> }
): PartialStateUpdater<NamedEntityState<Entity, Collection>>;
export function prependEntity<
  Entity extends { id: EntityId },
  Collection extends string,
>(
  entity: Entity,
  config: { collection: Collection }
): PartialStateUpdater<NamedEntityState<Entity, Collection>>;
export function prependEntity<Entity>(
  entity: Entity,
  config: { selectId: SelectEntityId<NoInfer<Entity>> }
): PartialStateUpdater<EntityState<Entity>>;
export function prependEntity(
  entity: any,
  config?: { collection?: string; selectId?: SelectEntityId<any> }
): PartialStateUpdater<EntityState<any> | NamedEntityState<any, string>> {
  const selectId = getEntityIdSelector(config);
  const stateKeys = getEntityStateKeys(config);

  return (state) => {
    const clonedState = cloneEntityState(state, stateKeys);
    const didMutate = addEntityMutably(clonedState, entity, selectId, true);

    return getEntityUpdaterResult(clonedState, stateKeys, didMutate);
  };
}
