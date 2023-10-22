import { PartialStateUpdater } from '@ngrx/signals';
import { EntityChanges, EntityState, NamedEntityState } from '../models';
import {
  cloneEntityState,
  getEntityStateKeys,
  getEntityUpdaterResult,
  updateEntitiesMutably,
} from '../helpers';

export function updateAllEntities<Entity>(
  changes: EntityChanges<Entity & {}>
): PartialStateUpdater<EntityState<Entity>>;
export function updateAllEntities<
  Collection extends string,
  State extends NamedEntityState<any, Collection>,
  Entity = State extends NamedEntityState<infer E, Collection> ? E : never
>(
  changes: EntityChanges<Entity & {}>,
  config: { collection: Collection }
): PartialStateUpdater<State>;
export function updateAllEntities(
  changes: EntityChanges<any>,
  config?: { collection?: string }
): PartialStateUpdater<EntityState<any>> {
  const stateKeys = getEntityStateKeys(config);

  return (state) => {
    const clonedState = cloneEntityState(state, stateKeys);
    const didMutate = updateEntitiesMutably(clonedState, state.ids, changes);

    return getEntityUpdaterResult(clonedState, stateKeys, didMutate);
  };
}
