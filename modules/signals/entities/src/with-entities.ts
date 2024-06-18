import { computed, Signal } from '@angular/core';
import {
  SignalStoreFeature,
  signalStoreFeature,
  withComputed,
  withState,
} from '@ngrx/signals';
import {
  EntityComputed,
  EntityId,
  EntityMap,
  EntityState,
  NamedEntityComputed,
  NamedEntityState,
} from './models';
import { getEntityStateKeys } from './helpers';

export function withEntities<Entity>(): SignalStoreFeature<
  { state: {}; computed: {}; methods: {} },
  {
    state: EntityState<Entity>;
    computed: EntityComputed<Entity>;
    methods: {};
  }
>;
export function withEntities<Entity, Collection extends string>(config: {
  entity: Entity;
  collection: Collection;
}): SignalStoreFeature<
  { state: {}; computed: {}; methods: {} },
  {
    state: NamedEntityState<Entity, Collection>;
    computed: NamedEntityComputed<Entity, Collection>;
    methods: {};
  }
>;
export function withEntities<Entity>(config: {
  entity: Entity;
}): SignalStoreFeature<
  { state: {}; computed: {}; methods: {} },
  {
    state: EntityState<Entity>;
    computed: EntityComputed<Entity>;
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
    }),
    withComputed((store: Record<string, Signal<unknown>>) => ({
      [entitiesKey]: computed(() => {
        const entityMap = store[entityMapKey]() as EntityMap<Entity>;
        const ids = store[idsKey]() as EntityId[];

        return ids.map((id) => entityMap[id]);
      }),
    }))
  );
}
