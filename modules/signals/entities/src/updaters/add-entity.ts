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

export function addEntity<Entity extends { id: EntityId }>(
  entity: Entity
): PartialStateUpdater<EntityState<Entity>>;
export function addEntity<Entity, Collection extends string>(
  entity: Entity,
  config: { collection: Collection; selectId: SelectEntityId<NoInfer<Entity>> }
): PartialStateUpdater<NamedEntityState<Entity, Collection>>;
export function addEntity<
  Entity extends { id: EntityId },
  Collection extends string,
>(
  entity: Entity,
  config: { collection: Collection }
): PartialStateUpdater<NamedEntityState<Entity, Collection>>;
export function addEntity<Entity>(
  entity: Entity,
  config: { selectId: SelectEntityId<NoInfer<Entity>> }
): PartialStateUpdater<EntityState<Entity>>;
/**
 * @description
 *
 * Adds an entity to the collection.
 * Does not override if entity with same ID exists.
 *
 * @usageNotes
 *
 * ```ts
 * import { patchState } from '@ngrx/signals';
 * import { addEntity } from '@ngrx/signals/entities';
 *
 * patchState(store, addEntity(todo));
 * ```
 */
export function addEntity(
  entity: any,
  config?: { collection?: string; selectId?: SelectEntityId<any> }
): PartialStateUpdater<EntityState<any> | NamedEntityState<any, string>> {
  const selectId = getEntityIdSelector(config);
  const stateKeys = getEntityStateKeys(config);

  return (state) => {
    const clonedState = cloneEntityState(state, stateKeys);
    const didMutate = addEntityMutably(clonedState, entity, selectId);

    return getEntityUpdaterResult(clonedState, stateKeys, didMutate);
  };
}
