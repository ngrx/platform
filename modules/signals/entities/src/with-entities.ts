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

export function withEntities<Entity>(): SignalStoreFeature<
  EmptyFeatureResult,
  {
    state: EntityState<Entity>;
    props: EntityProps<Entity>;
    methods: {};
  }
>;
export function withEntities<Entity, Collection extends string>(config: {
  entity: Entity;
  collection: Collection;
}): SignalStoreFeature<
  EmptyFeatureResult,
  {
    state: NamedEntityState<Entity, Collection>;
    props: NamedEntityProps<Entity, Collection>;
    methods: {};
  }
>;
export function withEntities<Entity>(config: {
  entity: Entity;
}): SignalStoreFeature<
  EmptyFeatureResult,
  {
    state: EntityState<Entity>;
    props: EntityProps<Entity>;
    methods: {};
  }
>;
export function withEntities<Entity>(config?: {
  entity: Entity;
  collection?: string;
}): SignalStoreFeature {
  const {
    selectedEntityIdKey,
    selectedEntityKey,
    entityMapKey,
    idsKey,
    entitiesKey,
  } = getEntityStateKeys(config);

  return signalStoreFeature(
    withState({
      [entityMapKey]: {},
      [idsKey]: [],
      [selectedEntityIdKey]: null,
    }),
    withComputed((store: Record<string, Signal<unknown>>) => ({
      [entitiesKey]: computed(() => {
        const entityMap = store[entityMapKey]() as EntityMap<Entity>;
        const ids = store[idsKey]() as EntityId[];

        return ids.map((id) => entityMap[id]);
      }),
      [selectedEntityKey]: computed(() => {
        const selectedEntityId = store[selectedEntityIdKey]() as EntityId;
        if (!selectedEntityId) return null;
        return (
          (store[entityMapKey]() as Record<EntityId, Entity>)[
            selectedEntityId
          ] ?? null
        );
      }),
    }))
  );
}
