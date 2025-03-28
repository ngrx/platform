import { PartialStateUpdater } from '@ngrx/signals';
import {
  EntityId,
  EntityState,
  NamedEntityState,
  SelectEntityId,
} from '../models';
import {
  addEntitiesMutably,
  cloneEntityState,
  getEntityIdSelector,
  getEntityStateKeys,
  getEntityUpdaterResult,
} from '../helpers';

export function addEntities<
  Entity extends { id: EntityId },
  Id extends EntityId = Entity extends { id: infer E } ? E : never
>(entities: Entity[]): PartialStateUpdater<EntityState<Entity, Id>>;
export function addEntities<
  Entity,
  Collection extends string,
  Id extends EntityId
>(
  entities: Entity[],
  config: {
    collection: Collection;
    selectId: SelectEntityId<NoInfer<Entity>, Id>;
  }
): PartialStateUpdater<NamedEntityState<Entity, Collection, Id>>;
export function addEntities<
  Entity extends { id: EntityId },
  Collection extends string,
  Id extends EntityId = Entity extends { id: infer E } ? E : never
>(
  entities: Entity[],
  config: { collection: Collection }
): PartialStateUpdater<NamedEntityState<Entity, Collection, Id>>;
export function addEntities<Entity, Id extends EntityId>(
  entities: Entity[],
  config: { selectId: SelectEntityId<NoInfer<Entity>, Id> }
): PartialStateUpdater<EntityState<Entity, Id>>;
export function addEntities(
  entities: any[],
  config?: { collection?: string; selectId?: SelectEntityId<any, EntityId> }
): PartialStateUpdater<
  EntityState<any, EntityId> | NamedEntityState<any, string, EntityId>
> {
  const selectId = getEntityIdSelector(config);
  const stateKeys = getEntityStateKeys(config);

  return (state) => {
    const clonedState = cloneEntityState(state, stateKeys);
    const didMutate = addEntitiesMutably(clonedState, entities, selectId);

    return getEntityUpdaterResult(clonedState, stateKeys, didMutate);
  };
}
