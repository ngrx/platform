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

export function setAllEntities<Entity extends { id: EntityId }>(
  entities: Entity[]
): PartialStateUpdater<EntityState<Entity>>;
export function setAllEntities<Entity, Collection extends string>(
  entities: Entity[],
  config: { collection: Collection; selectId: SelectEntityId<NoInfer<Entity>> }
): PartialStateUpdater<NamedEntityState<Entity, Collection>>;
export function setAllEntities<
  Entity extends { id: EntityId },
  Collection extends string,
>(
  entities: Entity[],
  config: { collection: Collection }
): PartialStateUpdater<NamedEntityState<Entity, Collection>>;
export function setAllEntities<Entity>(
  entities: Entity[],
  config: { selectId: SelectEntityId<NoInfer<Entity>> }
): PartialStateUpdater<EntityState<Entity>>;
/**
 * @description
 *
 * Replaces the entire entity collection with the provided entities.
 *
 * @usageNotes
 *
 * ```ts
 * import { patchState } from '@ngrx/signals';
 * import { setAllEntities } from '@ngrx/signals/entities';
 *
 * patchState(store, setAllEntities([todo1, todo2, todo3]));
 * ```
 */
export function setAllEntities(
  entities: any[],
  config?: { collection?: string; selectId?: SelectEntityId<any> }
): PartialStateUpdater<EntityState<any> | NamedEntityState<any, string>> {
  const selectId = getEntityIdSelector(config);
  const stateKeys = getEntityStateKeys(config);

  return () => {
    const state: EntityState<any> = { entityMap: {}, ids: [] };
    setEntitiesMutably(state, entities, selectId);

    return {
      [stateKeys.entityMapKey]: state.entityMap,
      [stateKeys.idsKey]: state.ids,
    };
  };
}
