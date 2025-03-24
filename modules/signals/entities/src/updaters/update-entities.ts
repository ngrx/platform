import { PartialStateUpdater } from '@ngrx/signals';
import {
  EntityChanges,
  EntityId,
  EntityPredicate,
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

export function updateEntities<
  Collection extends string,
  State extends NamedEntityState<any, Collection, Id>,
  Id extends EntityId,
  Entity = State extends NamedEntityState<infer E, Collection, Id> ? E : never
>(
  update: {
    ids: Id[];
    changes: EntityChanges<NoInfer<Entity>>;
  },
  config: {
    collection: Collection;
    selectId: SelectEntityId<NoInfer<Entity>, Id>;
  }
): PartialStateUpdater<State>;
export function updateEntities<
  Collection extends string,
  State extends NamedEntityState<any, Collection, Id>,
  Entity = State extends NamedEntityState<infer E, Collection, EntityId>
    ? E
    : never,
  Id extends EntityId = State extends NamedEntityState<
    infer E,
    Collection,
    EntityId
  >
    ? E extends { id: infer T }
      ? T
      : never
    : never
>(
  update: {
    predicate: EntityPredicate<Entity>;
    changes: EntityChanges<NoInfer<Entity>>;
  },
  config: {
    collection: Collection;
    selectId: SelectEntityId<NoInfer<Entity>, Id>;
  }
): PartialStateUpdater<State>;
export function updateEntities<
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
    ids: Id[];
    changes: EntityChanges<NoInfer<Entity>>;
  },
  config: { collection: Collection }
): PartialStateUpdater<State>;
export function updateEntities<
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
    predicate: EntityPredicate<Entity>;
    changes: EntityChanges<NoInfer<Entity>>;
  },
  config: { collection: Collection }
): PartialStateUpdater<State>;
export function updateEntities<Entity, Id extends EntityId>(
  update: {
    ids: Id[];
    changes: EntityChanges<NoInfer<Entity>>;
  },
  config: { selectId: SelectEntityId<NoInfer<Entity>, Id> }
): PartialStateUpdater<EntityState<Entity, Id>>;
export function updateEntities<Entity, Id extends EntityId>(
  update: {
    predicate: EntityPredicate<Entity>;
    changes: EntityChanges<NoInfer<Entity>>;
  },
  config: { selectId: SelectEntityId<NoInfer<Entity>, Id> }
): PartialStateUpdater<EntityState<Entity, Id>>;
export function updateEntities<
  Entity extends { id: EntityId },
  Id extends EntityId = Entity extends { id: infer E } ? E : never
>(update: {
  ids: Id[];
  changes: EntityChanges<NoInfer<Entity>>;
}): PartialStateUpdater<EntityState<Entity, Id>>;
export function updateEntities<
  Entity extends { id: EntityId },
  Id extends EntityId = Entity extends { id: infer E } ? E : never
>(update: {
  predicate: EntityPredicate<Entity>;
  changes: EntityChanges<NoInfer<Entity>>;
}): PartialStateUpdater<EntityState<Entity, Id>>;
export function updateEntities(
  update: ({ ids: EntityId[] } | { predicate: EntityPredicate<any> }) & {
    changes: EntityChanges<any>;
  },
  config?: { collection?: string; selectId?: SelectEntityId<any, EntityId> }
): PartialStateUpdater<
  EntityState<any, EntityId> | NamedEntityState<any, string, EntityId>
> {
  const selectId = getEntityIdSelector(config);
  const stateKeys = getEntityStateKeys(config);
  const idsOrPredicate = 'ids' in update ? update.ids : update.predicate;

  return (state) => {
    const clonedState = cloneEntityState(state, stateKeys);
    const didMutate = updateEntitiesMutably(
      clonedState,
      idsOrPredicate,
      update.changes,
      selectId
    );

    return getEntityUpdaterResult(clonedState, stateKeys, didMutate);
  };
}
