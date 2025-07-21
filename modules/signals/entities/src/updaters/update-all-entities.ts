import { PartialStateUpdater } from '@ngrx/signals';
import {
  EntityChanges,
  EntityId,
  EntityState,
  NamedEntityState,
  SelectEntityId,
} from '../models';
import {
  cloneEntityState,
  getEntityIdSelector,
  getEntityStateKeys,
  getEntityUpdaterResult,
  updateEntitiesMutably,
} from '../helpers';

/**
 * @public
 */
export function updateAllEntities<
  Collection extends string,
  State extends NamedEntityState<any, Collection>,
  Entity = State extends NamedEntityState<infer E, Collection> ? E : never
>(
  changes: EntityChanges<NoInfer<Entity>>,
  config: {
    collection: Collection;
    selectId: SelectEntityId<NoInfer<Entity>>;
  }
): PartialStateUpdater<State>;
/**
 * @public
 */
export function updateAllEntities<
  Collection extends string,
  State extends NamedEntityState<any, Collection>,
  Entity = State extends NamedEntityState<
    infer E extends { id: EntityId },
    Collection
  >
    ? E
    : never
>(
  changes: EntityChanges<NoInfer<Entity>>,
  config: { collection: Collection }
): PartialStateUpdater<State>;
/**
 * @public
 */
export function updateAllEntities<Entity>(
  changes: EntityChanges<NoInfer<Entity>>,
  config: { selectId: SelectEntityId<NoInfer<Entity>> }
): PartialStateUpdater<EntityState<Entity>>;
/**
 * @public
 */
export function updateAllEntities<Entity extends { id: EntityId }>(
  changes: EntityChanges<NoInfer<Entity>>
): PartialStateUpdater<EntityState<Entity>>;
export function updateAllEntities(
  changes: EntityChanges<any>,
  config?: { collection?: string; selectId?: SelectEntityId<any> }
): PartialStateUpdater<EntityState<any> | NamedEntityState<any, string>> {
  const selectId = getEntityIdSelector(config);
  const stateKeys = getEntityStateKeys(config);

  return (state) => {
    const clonedState = cloneEntityState(state, stateKeys);
    const didMutate = updateEntitiesMutably(
      clonedState,
      (state as Record<string, any>)[stateKeys.idsKey],
      changes,
      selectId
    );

    return getEntityUpdaterResult(clonedState, stateKeys, didMutate);
  };
}
