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

export function removeEntities<Id extends EntityId>(
  ids: Id[]
): PartialStateUpdater<EntityState<any, Id>>;
export function removeEntities<Entity>(
  predicate: EntityPredicate<Entity>
): PartialStateUpdater<EntityState<Entity, any>>;
export function removeEntities<Collection extends string, Id extends EntityId>(
  ids: Id[],
  config: { collection: Collection }
): PartialStateUpdater<NamedEntityState<any, Collection, Id>>;
export function removeEntities<
  Collection extends string,
  State extends NamedEntityState<any, Collection, any>,
  Entity = State extends NamedEntityState<infer E, Collection, any> ? E : never
>(
  predicate: EntityPredicate<Entity>,
  config: { collection: Collection }
): PartialStateUpdater<State>;
export function removeEntities(
  idsOrPredicate: EntityId[] | EntityPredicate<any>,
  config?: { collection?: string }
): PartialStateUpdater<
  EntityState<any, EntityId> | NamedEntityState<any, string, EntityId>
> {
  const stateKeys = getEntityStateKeys(config);

  return (state) => {
    const clonedState = cloneEntityState(state, stateKeys);
    const didMutate = removeEntitiesMutably(clonedState, idsOrPredicate);

    return getEntityUpdaterResult(clonedState, stateKeys, didMutate);
  };
}
