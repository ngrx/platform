import { PartialStateUpdater } from '@ngrx/signals';
import { EntityId, EntityState, NamedEntityState } from '../models';
import {
  cloneEntityState,
  getEntityStateKeys,
  getEntityUpdaterResult,
  removeEntitiesMutably,
} from '../helpers';

/**
 * @public
 */
export function removeEntity(
  id: EntityId
): PartialStateUpdater<EntityState<any>>;
/**
 * @public
 */
export function removeEntity<Collection extends string>(
  id: EntityId,
  config: { collection: Collection }
): PartialStateUpdater<NamedEntityState<any, Collection>>;
/**
 * @public
 */
export function removeEntity(
  id: EntityId,
  config?: { collection?: string }
): PartialStateUpdater<EntityState<any> | NamedEntityState<any, string>> {
  const stateKeys = getEntityStateKeys(config);

  return (state) => {
    const clonedState = cloneEntityState(state, stateKeys);
    const didMutate = removeEntitiesMutably(clonedState, [id]);

    return getEntityUpdaterResult(clonedState, stateKeys, didMutate);
  };
}
