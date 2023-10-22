import { PartialStateUpdater } from '@ngrx/signals';
import { EntityId, EntityState, NamedEntityState } from '../models';
import {
  cloneEntityState,
  getEntityStateKeys,
  getEntityUpdaterResult,
  removeEntitiesMutably,
} from '../helpers';

export function removeEntity(
  id: EntityId
): PartialStateUpdater<EntityState<any>>;
export function removeEntity<Collection extends string>(
  id: EntityId,
  config: { collection: Collection }
): PartialStateUpdater<NamedEntityState<any, Collection>>;
export function removeEntity(
  id: EntityId,
  config?: { collection?: string }
): PartialStateUpdater<EntityState<any>> {
  const stateKeys = getEntityStateKeys(config);

  return (state) => {
    const clonedState = cloneEntityState(state, stateKeys);
    const didMutate = removeEntitiesMutably(clonedState, [id]);

    return getEntityUpdaterResult(clonedState, stateKeys, didMutate);
  };
}
