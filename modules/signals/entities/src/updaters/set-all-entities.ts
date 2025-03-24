import { PartialStateUpdater } from '@ngrx/signals';
import {
  EntityId,
  EntityState,
  NamedEntityState,
  SelectEntityId,
} from '../models';
import {
  getEntityIdSelector,
  getEntityStateKeys,
  setEntitiesMutably,
} from '../helpers';

export function setAllEntities<
  Entity extends { id: EntityId },
  Id extends EntityId = Entity extends { id: infer E } ? E : never
>(entities: Entity[]): PartialStateUpdater<EntityState<Entity, Id>>;
export function setAllEntities<
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
export function setAllEntities<
  Entity extends { id: EntityId },
  Collection extends string,
  Id extends EntityId = Entity extends { id: infer E } ? E : never
>(
  entities: Entity[],
  config: { collection: Collection }
): PartialStateUpdater<NamedEntityState<Entity, Collection, Id>>;
export function setAllEntities<Entity, Id extends EntityId>(
  entities: Entity[],
  config: { selectId: SelectEntityId<NoInfer<Entity>, Id> }
): PartialStateUpdater<EntityState<Entity, Id>>;
export function setAllEntities(
  entities: any[],
  config?: { collection?: string; selectId?: SelectEntityId<any, EntityId> }
): PartialStateUpdater<
  EntityState<any, EntityId> | NamedEntityState<any, string, EntityId>
> {
  const selectId = getEntityIdSelector(config);
  const stateKeys = getEntityStateKeys(config);

  return () => {
    const state: EntityState<any, EntityId> = { entityMap: {}, ids: [] };
    setEntitiesMutably(state, entities, selectId);

    return {
      [stateKeys.entityMapKey]: state.entityMap,
      [stateKeys.idsKey]: state.ids,
    };
  };
}
