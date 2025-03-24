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

export function updateEntity<
  Collection extends string,
  State extends NamedEntityState<any, Collection, Id>,
  Id extends EntityId,
  Entity = State extends NamedEntityState<infer E, Collection, Id> ? E : never
>(
  update: {
    id: Id;
    changes: EntityChanges<NoInfer<Entity>>;
  },
  config: {
    collection: Collection;
    selectId: SelectEntityId<NoInfer<Entity>, Id>;
  }
): PartialStateUpdater<State>;
export function updateEntity<
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
  update: {
    id: Id;
    changes: EntityChanges<NoInfer<Entity>>;
  },
  config: { collection: Collection }
): PartialStateUpdater<State>;
export function updateEntity<Entity, Id extends EntityId>(
  update: {
    id: Id;
    changes: EntityChanges<NoInfer<Entity>>;
  },
  config: { selectId: SelectEntityId<NoInfer<Entity>, Id> }
): PartialStateUpdater<EntityState<Entity, Id>>;
export function updateEntity<
  Entity extends { id: EntityId },
  Id extends EntityId = Entity extends { id: infer E } ? E : never
>(update: {
  id: Id;
  changes: EntityChanges<NoInfer<Entity>>;
}): PartialStateUpdater<EntityState<Entity, Id>>;
export function updateEntity(
  update: {
    id: EntityId;
    changes: EntityChanges<any>;
  },
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
      [update.id],
      update.changes,
      selectId
    );

    return getEntityUpdaterResult(clonedState, stateKeys, didMutate);
  };
}
