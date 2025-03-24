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

export function updateAllEntities<
  Collection extends string,
  State extends NamedEntityState<any, Collection, Id>,
  Id extends EntityId,
  Entity = State extends NamedEntityState<infer E, Collection, Id> ? E : never
>(
  changes: EntityChanges<NoInfer<Entity>>,
  config: {
    collection: Collection;
    selectId: SelectEntityId<NoInfer<Entity>, Id>;
  }
): PartialStateUpdater<State>;
export function updateAllEntities<
  Collection extends string,
  State extends NamedEntityState<any, Collection, Id>,
  Entity = State extends NamedEntityState<
    infer E extends { id: EntityId },
    Collection,
    EntityId
  >
    ? E
    : never,
  Id extends EntityId = State extends NamedEntityState<
    infer E extends { id: EntityId },
    Collection,
    EntityId
  >
    ? E extends { id: infer T }
      ? T
      : never
    : never
>(
  changes: EntityChanges<NoInfer<Entity>>,
  config: { collection: Collection }
): PartialStateUpdater<State>;
export function updateAllEntities<Entity, Id extends EntityId>(
  changes: EntityChanges<NoInfer<Entity>>,
  config: { selectId: SelectEntityId<NoInfer<Entity>, Id> }
): PartialStateUpdater<EntityState<Entity, Id>>;
export function updateAllEntities<
  Entity extends { id: EntityId },
  Id extends EntityId = Entity extends { id: infer E } ? E : never
>(
  changes: EntityChanges<NoInfer<Entity>>
): PartialStateUpdater<EntityState<Entity, Id>>;
export function updateAllEntities(
  changes: EntityChanges<any>,
  config?: { collection?: string; selectId?: SelectEntityId<any, EntityId> }
): PartialStateUpdater<
  EntityState<any, EntityId> | NamedEntityState<any, string, EntityId>
> {
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
