import { PartialStateUpdater } from '@ngrx/signals';
import {
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
  setEntityMutably,
} from '../helpers';

export function upsertEntity<Entity extends { id: EntityId }>(
  entity: Entity
): PartialStateUpdater<EntityState<Entity>>;
export function upsertEntity<Entity, Collection extends string>(
  entity: Entity,
  config: { collection: Collection; selectId: SelectEntityId<NoInfer<Entity>> }
): PartialStateUpdater<NamedEntityState<Entity, Collection>>;
export function upsertEntity<
  Entity extends { id: EntityId },
  Collection extends string
>(
  entity: Entity,
  config: { collection: Collection }
): PartialStateUpdater<NamedEntityState<Entity, Collection>>;
export function upsertEntity<Entity>(
  entity: Entity,
  config: { selectId: SelectEntityId<NoInfer<Entity>> }
): PartialStateUpdater<EntityState<Entity>>;
export function upsertEntity(
  entity: any,
  config?: { collection?: string; selectId?: SelectEntityId<any> }
): PartialStateUpdater<EntityState<any> | NamedEntityState<any, string>> {
  const selectId = getEntityIdSelector(config);
  const stateKeys = getEntityStateKeys(config);

  return (state) => {
    const clonedState = cloneEntityState(state, stateKeys);
    const didMutate = setEntityMutably(clonedState, entity, selectId, false);

    return getEntityUpdaterResult(clonedState, stateKeys, didMutate);
  };
}
