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

export function setEntity<
  Entity extends { id: EntityId },
  Id extends EntityId = Entity extends { id: infer E } ? E : never
>(entity: Entity): PartialStateUpdater<EntityState<Entity, Id>>;
export function setEntity<
  Entity,
  Collection extends string,
  Id extends EntityId
>(
  entity: Entity,
  config: {
    collection: Collection;
    selectId: SelectEntityId<NoInfer<Entity>, Id>;
  }
): PartialStateUpdater<NamedEntityState<Entity, Collection, Id>>;
export function setEntity<
  Entity extends { id: EntityId },
  Collection extends string,
  Id extends EntityId = Entity extends { id: infer E } ? E : never
>(
  entity: Entity,
  config: { collection: Collection }
): PartialStateUpdater<NamedEntityState<Entity, Collection, Id>>;
export function setEntity<Entity, Id extends EntityId>(
  entity: Entity,
  config: { selectId: SelectEntityId<NoInfer<Entity>, Id> }
): PartialStateUpdater<EntityState<Entity, Id>>;
export function setEntity(
  entity: any,
  config?: { collection?: string; selectId?: SelectEntityId<any, EntityId> }
): PartialStateUpdater<
  EntityState<any, EntityId> | NamedEntityState<any, string, EntityId>
> {
  const selectId = getEntityIdSelector(config);
  const stateKeys = getEntityStateKeys(config);

  return (state) => {
    const clonedState = cloneEntityState(state, stateKeys);
    const didMutate = setEntityMutably(clonedState, entity, selectId);

    return getEntityUpdaterResult(clonedState, stateKeys, didMutate);
  };
}
