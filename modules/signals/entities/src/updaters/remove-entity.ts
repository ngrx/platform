import { PartialStateUpdater } from '@ngrx/signals';
import { EntityId, EntityState, NamedEntityState } from '../models';
import {
  cloneEntityState,
  getEntityStateKeys,
  getEntityUpdaterResult,
  removeEntitiesMutably,
} from '../helpers';

export function removeEntity<Id extends EntityId>(
  id: Id
): PartialStateUpdater<EntityState<any, Id>>;
export function removeEntity<Collection extends string, Id extends EntityId>(
  id: Id,
  config: { collection: Collection }
): PartialStateUpdater<NamedEntityState<any, Collection, Id>>;
export function removeEntity(
  id: EntityId,
  config?: { collection?: string }
): PartialStateUpdater<
  EntityState<any, EntityId> | NamedEntityState<any, string, EntityId>
> {
  const stateKeys = getEntityStateKeys(config);

  return (state) => {
    const clonedState = cloneEntityState(state, stateKeys);
    const didMutate = removeEntitiesMutably(clonedState, [id]);

    return getEntityUpdaterResult(clonedState, stateKeys, didMutate);
  };
}
