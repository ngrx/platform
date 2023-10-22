import { computed } from '@angular/core';
import {
  SignalStoreFeature,
  signalStoreFeature,
  withComputed,
  withState,
} from '@ngrx/signals';
import {
  EntityId,
  EntityMap,
  EntitySignals,
  EntityState,
  NamedEntitySignals,
  NamedEntityState,
} from './models';
import { getEntityStateKeys } from './helpers';

export function withEntities<Entity>(): SignalStoreFeature<
  { state: {}; signals: {}; methods: {} },
  {
    state: EntityState<Entity>;
    signals: EntitySignals<Entity>;
    methods: {};
  }
>;
export function withEntities<Entity, Collection extends string>(config: {
  entity: Entity;
  collection: Collection;
}): SignalStoreFeature<
  { state: {}; signals: {}; methods: {} },
  {
    state: NamedEntityState<Entity, Collection>;
    signals: NamedEntitySignals<Entity, Collection>;
    methods: {};
  }
>;
export function withEntities<Entity>(config: {
  entity: Entity;
}): SignalStoreFeature<
  { state: {}; signals: {}; methods: {} },
  {
    state: EntityState<Entity>;
    signals: EntitySignals<Entity>;
    methods: {};
  }
>;
export function withEntities<Entity>(config?: {
  entity: Entity;
  collection?: string;
}): SignalStoreFeature {
  const { entityMapKey, idsKey, entitiesKey } = getEntityStateKeys(config);

  return signalStoreFeature(
    withState({
      [entityMapKey]: {},
      [idsKey]: [],
    } as any),
    withComputed((store) => ({
      [entitiesKey]: computed(() => {
        const entityMap = store[entityMapKey]() as EntityMap<Entity>;
        const ids = store[idsKey]() as EntityId[];

        return ids.map((id) => entityMap[id]);
      }),
    }))
  );
}
