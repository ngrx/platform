import { PartialStateUpdater } from '@ngrx/signals';
import {
  EntityChanges,
  EntityId,
  EntityState,
  NamedEntityState,
} from '../models';
import {
  cloneEntityState,
  getEntityStateKeys,
  getEntityUpdaterResult,
  updateEntitiesMutably,
} from '../helpers';

export function updateEntity<Entity>(update: {
  id: EntityId;
  changes: EntityChanges<Entity & {}>;
}): PartialStateUpdater<EntityState<Entity>>;
export function updateEntity<
  Collection extends string,
  State extends NamedEntityState<any, Collection>,
  Entity = State extends NamedEntityState<infer E, Collection> ? E : never
>(
  update: {
    id: EntityId;
    changes: EntityChanges<Entity & {}>;
  },
  config: { collection: Collection }
): PartialStateUpdater<State>;
export function updateEntity(
  update: {
    id: EntityId;
    changes: EntityChanges<any>;
  },
  config?: { collection?: string }
): PartialStateUpdater<EntityState<any>> {
  const stateKeys = getEntityStateKeys(config);

  return (state) => {
    const clonedState = cloneEntityState(state, stateKeys);
    const didMutate = updateEntitiesMutably(
      clonedState,
      [update.id],
      update.changes
    );

    return getEntityUpdaterResult(clonedState, stateKeys, didMutate);
  };
}
