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
  setEntitiesMutably,
} from '../helpers';

export function upsertEntities<Entity extends { id: EntityId }>(
  entities: Entity[]
): PartialStateUpdater<EntityState<Entity>>;
export function upsertEntities<Entity, Collection extends string>(
  entities: Entity[],
  config: { collection: Collection; selectId: SelectEntityId<NoInfer<Entity>> }
): PartialStateUpdater<NamedEntityState<Entity, Collection>>;
export function upsertEntities<
  Entity extends { id: EntityId },
  Collection extends string
>(
  entities: Entity[],
  config: { collection: Collection }
): PartialStateUpdater<NamedEntityState<Entity, Collection>>;
export function upsertEntities<Entity>(
  entities: Entity[],
  config: { selectId: SelectEntityId<NoInfer<Entity>> }
): PartialStateUpdater<EntityState<Entity>>;
export function upsertEntities(
  entities: any[],
  config?: { collection?: string; selectId?: SelectEntityId<any> }
): PartialStateUpdater<EntityState<any> | NamedEntityState<any, string>> {
  const selectId = getEntityIdSelector(config);
  const stateKeys = getEntityStateKeys(config);

  return (state) => {
    const clonedState = cloneEntityState(state, stateKeys);
    const didMutate = setEntitiesMutably(
      clonedState,
      entities,
      selectId,
      false
    );

    return getEntityUpdaterResult(clonedState, stateKeys, didMutate);
  };
}
