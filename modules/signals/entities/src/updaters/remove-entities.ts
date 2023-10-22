import { PartialStateUpdater } from '@ngrx/signals';
import {
  EntityId,
  EntityPredicate,
  EntityState,
  NamedEntityState,
} from '../models';
import {
  cloneEntityState,
  getEntityStateKeys,
  getEntityUpdaterResult,
  removeEntitiesMutably,
} from '../helpers';

export function removeEntities(
  ids: EntityId[]
): PartialStateUpdater<EntityState<any>>;
export function removeEntities<Entity>(
  predicate: EntityPredicate<Entity>
): PartialStateUpdater<EntityState<Entity>>;
export function removeEntities<Collection extends string>(
  ids: EntityId[],
  config: { collection: Collection }
): PartialStateUpdater<NamedEntityState<any, Collection>>;
export function removeEntities<
  Collection extends string,
  State extends NamedEntityState<any, Collection>,
  Entity = State extends NamedEntityState<infer E, Collection> ? E : never
>(
  predicate: EntityPredicate<Entity>,
  config: { collection: Collection }
): PartialStateUpdater<State>;
export function removeEntities(
  idsOrPredicate: EntityId[] | EntityPredicate<any>,
  config?: { collection?: string }
): PartialStateUpdater<EntityState<any> | NamedEntityState<any, string>> {
  const stateKeys = getEntityStateKeys(config);

  return (state) => {
    const clonedState = cloneEntityState(state, stateKeys);
    const didMutate = removeEntitiesMutably(clonedState, idsOrPredicate);

    return getEntityUpdaterResult(clonedState, stateKeys, didMutate);
  };
}
