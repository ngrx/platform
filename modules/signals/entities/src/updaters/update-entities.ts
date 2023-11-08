import { PartialStateUpdater } from '@ngrx/signals';
import {
  EntityChanges,
  EntityId,
  EntityPredicate,
  EntityState,
  NamedEntityState,
} from '../models';
import {
  cloneEntityState,
  getEntityStateKeys,
  getEntityUpdaterResult,
  updateEntitiesMutably,
} from '../helpers';

export function updateEntities<Entity>(update: {
  ids: EntityId[];
  changes: EntityChanges<Entity & {}>;
}): PartialStateUpdater<EntityState<Entity>>;
export function updateEntities<Entity>(update: {
  predicate: EntityPredicate<Entity>;
  changes: EntityChanges<Entity & {}>;
}): PartialStateUpdater<EntityState<Entity>>;
export function updateEntities<
  Collection extends string,
  State extends NamedEntityState<any, Collection>,
  Entity = State extends NamedEntityState<infer E, Collection> ? E : never
>(
  update: {
    ids: EntityId[];
    changes: EntityChanges<Entity & {}>;
  },
  config: { collection: Collection }
): PartialStateUpdater<State>;
export function updateEntities<
  Collection extends string,
  State extends NamedEntityState<any, Collection>,
  Entity = State extends NamedEntityState<infer E, Collection> ? E : never
>(
  update: {
    predicate: EntityPredicate<Entity>;
    changes: EntityChanges<Entity & {}>;
  },
  config: { collection: Collection }
): PartialStateUpdater<State>;
export function updateEntities(
  update: ({ ids: EntityId[] } | { predicate: EntityPredicate<any> }) & {
    changes: EntityChanges<any>;
  },
  config?: { collection?: string }
): PartialStateUpdater<EntityState<any> | NamedEntityState<any, string>> {
  const stateKeys = getEntityStateKeys(config);
  const idsOrPredicate = 'ids' in update ? update.ids : update.predicate;

  return (state) => {
    const clonedState = cloneEntityState(state, stateKeys);
    const didMutate = updateEntitiesMutably(
      clonedState,
      idsOrPredicate,
      update.changes
    );

    return getEntityUpdaterResult(clonedState, stateKeys, didMutate);
  };
}
