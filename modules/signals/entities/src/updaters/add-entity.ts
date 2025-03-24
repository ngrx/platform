import { PartialStateUpdater } from '@ngrx/signals';
import {
  EntityId,
  EntityState,
  NamedEntityState,
  SelectEntityId,
} from '../models';
import {
  addEntityMutably,
  cloneEntityState,
  getEntityIdSelector,
  getEntityStateKeys,
  getEntityUpdaterResult,
} from '../helpers';

export function addEntity<
  Entity extends { id: EntityId },
  Id extends EntityId = Entity extends { id: infer E } ? E : never
>(entity: Entity): PartialStateUpdater<EntityState<Entity, Id>>;
export function addEntity<
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
export function addEntity<
  Entity extends { id: EntityId },
  Collection extends string,
  Id extends EntityId = Entity extends { id: infer E } ? E : never
>(
  entity: Entity,
  config: { collection: Collection }
): PartialStateUpdater<NamedEntityState<Entity, Collection, Id>>;
export function addEntity<Entity, Id extends EntityId>(
  entity: Entity,
  config: { selectId: SelectEntityId<NoInfer<Entity>, Id> }
): PartialStateUpdater<EntityState<Entity, Id>>;
export function addEntity(
  entity: any,
  config?: { collection?: string; selectId?: SelectEntityId<any, EntityId> }
): PartialStateUpdater<
  EntityState<any, EntityId> | NamedEntityState<any, string, EntityId>
> {
  const selectId = getEntityIdSelector(config);
  const stateKeys = getEntityStateKeys(config);

  return (state) => {
    const clonedState = cloneEntityState(state, stateKeys);
    const didMutate = addEntityMutably(clonedState, entity, selectId);

    return getEntityUpdaterResult(clonedState, stateKeys, didMutate);
  };
}
