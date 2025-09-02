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
  State extends NamedEntityState<any, Collection>,
  Entity = State extends NamedEntityState<infer E, Collection> ? E : never,
>(
  update: {
    id: EntityId;
    changes: EntityChanges<NoInfer<Entity>>;
  },
  config: {
    collection: Collection;
    selectId: SelectEntityId<NoInfer<Entity>>;
  }
): PartialStateUpdater<State>;
export function updateEntity<
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
    id: EntityId;
    changes: EntityChanges<NoInfer<Entity>>;
  },
  config: { collection: Collection }
): PartialStateUpdater<State>;
export function updateEntity<Entity>(
  update: {
    id: EntityId;
    changes: EntityChanges<NoInfer<Entity>>;
  },
  config: { selectId: SelectEntityId<NoInfer<Entity>> }
): PartialStateUpdater<EntityState<Entity>>;
export function updateEntity<Entity extends { id: EntityId }>(update: {
  id: EntityId;
  changes: EntityChanges<NoInfer<Entity>>;
}): PartialStateUpdater<EntityState<Entity>>;
export function updateEntity(
  update: {
    id: EntityId;
    changes: EntityChanges<any>;
  },
  config?: { collection?: string; selectId?: SelectEntityId<any> }
): PartialStateUpdater<EntityState<any> | NamedEntityState<any, string>> {
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
