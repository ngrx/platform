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

export function prependEntities<Entity extends { id: EntityId }>(
  entities: Entity[]
): PartialStateUpdater<EntityState<Entity>>;
export function prependEntities<Entity, Collection extends string>(
  entities: Entity[],
  config: { collection: Collection; selectId: SelectEntityId<NoInfer<Entity>> }
): PartialStateUpdater<NamedEntityState<Entity, Collection>>;
export function prependEntities<
  Entity extends { id: EntityId },
  Collection extends string,
>(
  entities: Entity[],
  config: { collection: Collection }
): PartialStateUpdater<NamedEntityState<Entity, Collection>>;
export function prependEntities<Entity>(
  entities: Entity[],
  config: { selectId: SelectEntityId<NoInfer<Entity>> }
): PartialStateUpdater<EntityState<Entity>>;
export function prependEntities(
  entities: any[],
  config?: { collection?: string; selectId?: SelectEntityId<any> }
): PartialStateUpdater<EntityState<any> | NamedEntityState<any, string>> {
  const selectId = getEntityIdSelector(config);
  const stateKeys = getEntityStateKeys(config);

  return (state) => {
    const clonedState = cloneEntityState(state, stateKeys);

    const uniqueEntities: any[] = [];
    const seenIds = new Set<EntityId>();

    for (const entity of entities) {
      const id = selectId(entity);

      if (!seenIds.has(id)) {
        uniqueEntities.unshift(entity);
        seenIds.add(id);
      }
    }

    const didMutate = addEntitiesMutably(
      clonedState,
      uniqueEntities,
      selectId,
      true
    );

    return getEntityUpdaterResult(clonedState, stateKeys, didMutate);
  };
}
