import {
  didMutate,
  EntityChanges,
  EntityId,
  EntityPredicate,
  EntityState,
  Mutated,
  SelectEntityId,
} from './models';

declare const ngDevMode: unknown;
const defaultSelectId: SelectEntityId<{ id: EntityId }> = (entity) => entity.id;

export function getEntityIdSelector(config?: {
  selectId?: SelectEntityId<any>;
}): SelectEntityId<any> {
  return config?.selectId ?? defaultSelectId;
}

export function getEntityStateKeys(config?: { collection?: string }): {
  selectedEntityIdKey: string;
  selectedEntityKey: string;
  entityMapKey: string;
  idsKey: string;
  entitiesKey: string;
} {
  const collection = config?.collection;
  const selectedEntityIdKey =
    collection === undefined ? 'selectedId' : `${collection}SelectedId`;
  const selectedEntityKey =
    collection === undefined ? 'selectedEntity' : `${collection}SelectedEntity`;
  const entityMapKey =
    collection === undefined ? 'entityMap' : `${collection}EntityMap`;
  const idsKey = collection === undefined ? 'ids' : `${collection}Ids`;
  const entitiesKey =
    collection === undefined ? 'entities' : `${collection}Entities`;

  return {
    selectedEntityIdKey,
    selectedEntityKey,
    entityMapKey,
    idsKey,
    entitiesKey,
  };
}

export function cloneEntityState(
  state: Record<string, any>,
  stateKeys: {
    selectedEntityIdKey: string;
    entityMapKey: string;
    idsKey: string;
  }
): EntityState<any> {
  return {
    entityMap: { ...state[stateKeys.entityMapKey] },
    ids: [...state[stateKeys.idsKey]],
    selectedId: state[stateKeys.selectedEntityIdKey],
  };
}

export function getEntityUpdaterResult(
  state: EntityState<any>,
  stateKeys: {
    selectedEntityIdKey: string;
    entityMapKey: string;
    idsKey: string;
  },
  mutated: Mutated
): Record<string, any> {
  const changes: Record<string, any> = {};

  if (didMutate(mutated, Mutated.Entities))
    changes[stateKeys.entityMapKey] = state.entityMap;

  if (didMutate(mutated, Mutated.Ids)) changes[stateKeys.idsKey] = state.ids;

  if (didMutate(mutated, Mutated.SelectedEntityId))
    changes[stateKeys.selectedEntityIdKey] = state.selectedId;

  return changes;
}

export function addEntityMutably(
  state: EntityState<any>,
  entity: any,
  selectId: SelectEntityId<any>
): Mutated {
  const id = selectId(entity);

  if (state.entityMap[id]) {
    return Mutated.None;
  }

  state.entityMap[id] = entity;
  state.ids.push(id);

  return Mutated.Entities | Mutated.Ids;
}

export function addEntitiesMutably(
  state: EntityState<any>,
  entities: any[],
  selectId: SelectEntityId<any>
): Mutated {
  let mutated = Mutated.None;

  for (const entity of entities) {
    const result = addEntityMutably(state, entity, selectId);

    if (didMutate(result, Mutated.Entities | Mutated.Ids)) {
      mutated = result;
    }
  }

  return mutated;
}

export function setEntityMutably(
  state: EntityState<any>,
  entity: any,
  selectId: SelectEntityId<any>
): Mutated {
  const id = selectId(entity);

  if (state.entityMap[id]) {
    state.entityMap[id] = entity;
    return Mutated.Entities;
  }

  state.entityMap[id] = entity;
  state.ids.push(id);

  return Mutated.Entities | Mutated.Ids;
}

export function setEntitiesMutably(
  state: EntityState<any>,
  entities: any[],
  selectId: SelectEntityId<any>
): Mutated {
  let mutated = Mutated.None;

  for (const entity of entities) {
    const result = setEntityMutably(state, entity, selectId);

    if (didMutate(mutated, Mutated.Entities | Mutated.Ids)) {
      continue;
    }

    mutated = result;
  }

  return mutated;
}

export function removeEntitiesMutably(
  state: EntityState<any>,
  idsOrPredicate: EntityId[] | EntityPredicate<any>
): Mutated {
  const ids = Array.isArray(idsOrPredicate)
    ? idsOrPredicate
    : state.ids.filter((id) => idsOrPredicate(state.entityMap[id]));
  let mutated = Mutated.None;

  for (const id of ids) {
    if (state.entityMap[id]) {
      delete state.entityMap[id];
      mutated = Mutated.Entities | Mutated.Ids;
    }
  }

  if (didMutate(mutated, Mutated.Entities | Mutated.Ids)) {
    state.ids = state.ids.filter((id) => id in state.entityMap);
  }

  return mutated;
}

export function updateEntitiesMutably(
  state: EntityState<any>,
  idsOrPredicate: EntityId[] | EntityPredicate<any>,
  changes: EntityChanges<any>,
  selectId: SelectEntityId<any>
): Mutated {
  const ids = Array.isArray(idsOrPredicate)
    ? idsOrPredicate
    : state.ids.filter((id) => idsOrPredicate(state.entityMap[id]));
  let newIds: Record<EntityId, EntityId> | undefined = undefined;
  let mutated = Mutated.None;

  for (const id of ids) {
    const entity = state.entityMap[id];

    if (entity) {
      const changesRecord =
        typeof changes === 'function' ? changes(entity) : changes;
      state.entityMap[id] = { ...entity, ...changesRecord };
      mutated = Mutated.Entities;

      const newId = selectId(state.entityMap[id]);
      if (newId !== id) {
        state.entityMap[newId] = state.entityMap[id];
        delete state.entityMap[id];

        newIds = newIds || {};
        newIds[id] = newId;
      }
    }
  }

  if (newIds) {
    state.ids = state.ids.map((id) => newIds[id] ?? id);
    mutated = Mutated.Entities | Mutated.Ids;
  }

  if (
    typeof ngDevMode !== 'undefined' &&
    ngDevMode &&
    state.ids.length !== Object.keys(state.entityMap).length
  ) {
    console.warn(
      '@ngrx/signals/entities: Entities with IDs:',
      ids,
      'are not updated correctly.',
      'Make sure to apply valid changes when using `updateEntity`,',
      '`updateEntities`, and `updateAllEntities` updaters.'
    );
  }

  return mutated;
}
