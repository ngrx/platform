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
  State extends NamedEntityState<any, Collection>,
  Entity = State extends NamedEntityState<infer E, Collection> ? E : never,
>(
  update: {
    ids: EntityId[];
    changes: EntityChanges<NoInfer<Entity>>;
  },
  config: {
    collection: Collection;
    selectId: SelectEntityId<NoInfer<Entity>>;
  }
): PartialStateUpdater<State>;
export function updateEntities<
  Collection extends string,
  State extends NamedEntityState<any, Collection>,
  Entity = State extends NamedEntityState<infer E, Collection> ? E : never,
>(
  update: {
    predicate: EntityPredicate<Entity>;
    changes: EntityChanges<NoInfer<Entity>>;
  },
  config: {
    collection: Collection;
    selectId: SelectEntityId<NoInfer<Entity>>;
  }
): PartialStateUpdater<State>;
export function updateEntities<
  Collection extends string,
  State extends NamedEntityState<any, Collection>,
  Entity = State extends NamedEntityState<
    infer E extends { id: EntityId },
    Collection
  >
    ? E
    : never,
>(
  update: {
    ids: EntityId[];
    changes: EntityChanges<NoInfer<Entity>>;
  },
  config: { collection: Collection }
): PartialStateUpdater<State>;
export function updateEntities<
  Collection extends string,
  State extends NamedEntityState<any, Collection>,
  Entity = State extends NamedEntityState<
    infer E extends { id: EntityId },
    Collection
  >
    ? E
    : never,
>(
  update: {
    predicate: EntityPredicate<Entity>;
    changes: EntityChanges<NoInfer<Entity>>;
  },
  config: { collection: Collection }
): PartialStateUpdater<State>;
export function updateEntities<Entity>(
  update: {
    ids: EntityId[];
    changes: EntityChanges<NoInfer<Entity>>;
  },
  config: { selectId: SelectEntityId<NoInfer<Entity>> }
): PartialStateUpdater<EntityState<Entity>>;
export function updateEntities<Entity>(
  update: {
    predicate: EntityPredicate<Entity>;
    changes: EntityChanges<NoInfer<Entity>>;
  },
  config: { selectId: SelectEntityId<NoInfer<Entity>> }
): PartialStateUpdater<EntityState<Entity>>;
export function updateEntities<Entity extends { id: EntityId }>(update: {
  ids: EntityId[];
  changes: EntityChanges<NoInfer<Entity>>;
}): PartialStateUpdater<EntityState<Entity>>;
export function updateEntities<Entity extends { id: EntityId }>(update: {
  predicate: EntityPredicate<Entity>;
  changes: EntityChanges<NoInfer<Entity>>;
}): PartialStateUpdater<EntityState<Entity>>;
/**
 * @description
 *
 * Updates multiple entities in the collection by IDs or predicate.
 * Supports partial updates.
 *
 * @usageNotes
 *
 * ```ts
 * import { patchState } from '@ngrx/signals';
 * import { updateEntities } from '@ngrx/signals/entities';
 *
 * // Update by IDs
 * patchState(store, updateEntities({ ids: [1, 2], changes: { completed: true } }));
 *
 * // Update by predicate
 * patchState(store, updateEntities({ predicate: (todo) => !todo.completed, changes: { text: '' } }));
 * ```
 */
export function updateEntities(
  update: ({ ids: EntityId[] } | { predicate: EntityPredicate<any> }) & {
    changes: EntityChanges<any>;
  },
  config?: { collection?: string; selectId?: SelectEntityId<any> }
): PartialStateUpdater<EntityState<any> | NamedEntityState<any, string>> {
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
