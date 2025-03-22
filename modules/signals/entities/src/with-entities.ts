import { computed, Signal } from '@angular/core';
import {
  EmptyFeatureResult,
  SignalStoreFeature,
  signalStoreFeature,
  withComputed,
  withState,
} from '@ngrx/signals';
import {
  EntityProps,
  EntityId,
  EntityMap,
  EntityState,
  NamedEntityProps,
  NamedEntityState,
} from './models';
import { getEntityStateKeys } from './helpers';

export function withEntities<
  Entity,
  Id extends EntityId = EntityId
>(): SignalStoreFeature<
  EmptyFeatureResult,
  {
    state: EntityState<Entity, Id>;
    props: EntityProps<Entity>;
    methods: {};
  }
>;
export function withEntities<
  Entity,
  Collection extends string,
  Id extends EntityId = EntityId
>(config: {
  entity: Entity;
  collection: Collection;
}): SignalStoreFeature<
  EmptyFeatureResult,
  {
    state: NamedEntityState<Entity, Collection, Id>;
    props: NamedEntityProps<Entity, Collection>;
    methods: {};
  }
>;
export function withEntities<Entity, Id extends EntityId = EntityId>(config: {
  entity: Entity;
}): SignalStoreFeature<
  EmptyFeatureResult,
  {
    state: EntityState<Entity, Id>;
    props: EntityProps<Entity>;
    methods: {};
  }
>;
export function withEntities<Entity, Id extends EntityId = EntityId>(config?: {
  entity: Entity;
  collection?: string;
}): SignalStoreFeature {
  const { entityMapKey, idsKey, entitiesKey } = getEntityStateKeys(config);

  return signalStoreFeature(
    withState({
      [entityMapKey]: {},
      [idsKey]: [],
    }),
    withComputed((store: Record<string, Signal<unknown>>) => ({
      [entitiesKey]: computed(() => {
        const entityMap = store[entityMapKey]() as EntityMap<Entity, Id>;
        const ids = store[idsKey]() as Id[];

        return ids.map((id) => entityMap[id]);
      }),
    }))
  );
}
