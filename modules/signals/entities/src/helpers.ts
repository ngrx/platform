import {
  DidMutate,
  EntityChanges,
  EntityId,
  EntityPredicate,
  EntityState,
  SelectEntityId,
} from './models';

const defaultSelectId: SelectEntityId<{ id: EntityId }> = (entity) => entity.id;

export function getEntityIdSelector(config?: {
  selectId?: SelectEntityId<any>;
}): SelectEntityId<any> {
  return config?.selectId ?? defaultSelectId;
}

export function getEntityStateKeys(config?: { collection?: string }): {
  entityMapKey: string;
  idsKey: string;
  entitiesKey: string;
} {
  const collection = config?.collection;
  const entityMapKey =
    collection === undefined ? 'entityMap' : `${collection}EntityMap`;
  const idsKey = collection === undefined ? 'ids' : `${collection}Ids`;
  const entitiesKey =
    collection === undefined ? 'entities' : `${collection}Entities`;

  return { entityMapKey, idsKey, entitiesKey };
}

export function cloneEntityState(
  state: Record<string, any>,
  stateKeys: {
    entityMapKey: string;
    idsKey: string;
  }
): EntityState<any> {
  return {
    entityMap: { ...state[stateKeys.entityMapKey] },
    ids: [...state[stateKeys.idsKey]],
  };
}

export function getEntityUpdaterResult(
  state: EntityState<any>,
  stateKeys: {
    entityMapKey: string;
    idsKey: string;
  },
  didMutate: DidMutate
): Record<string, any> {
  switch (didMutate) {
    case DidMutate.Both: {
      return {
        [stateKeys.entityMapKey]: state.entityMap,
        [stateKeys.idsKey]: state.ids,
      };
    }
    case DidMutate.Entities: {
      return { [stateKeys.entityMapKey]: state.entityMap };
    }
    default: {
      return {};
    }
  }
}

export function addEntityMutably(
  state: EntityState<any>,
  entity: any,
  selectId: SelectEntityId<any>
): DidMutate {
  const id = selectId(entity);

  if (state.entityMap[id]) {
    return DidMutate.None;
  }

  state.entityMap[id] = entity;
  state.ids.push(id);

  return DidMutate.Both;
}

export function addEntitiesMutably(
  state: EntityState<any>,
  entities: any[],
  selectId: SelectEntityId<any>
): DidMutate {
  let didMutate = DidMutate.None;

  for (const entity of entities) {
    const result = addEntityMutably(state, entity, selectId);

    if (result === DidMutate.Both) {
      didMutate = result;
    }
  }

  return didMutate;
}

export function setEntityMutably(
  state: EntityState<any>,
  entity: any,
  selectId: SelectEntityId<any>
): DidMutate {
  const id = selectId(entity);

  if (state.entityMap[id]) {
    state.entityMap[id] = entity;
    return DidMutate.Entities;
  }

  state.entityMap[id] = entity;
  state.ids.push(id);

  return DidMutate.Both;
}

export function setEntitiesMutably(
  state: EntityState<any>,
  entities: any[],
  selectId: SelectEntityId<any>
): DidMutate {
  let didMutate = DidMutate.None;

  for (const entity of entities) {
    const result = setEntityMutably(state, entity, selectId);

    if (didMutate === DidMutate.Both) {
      continue;
    }

    didMutate = result;
  }

  return didMutate;
}

export function removeEntitiesMutably(
  state: EntityState<any>,
  idsOrPredicate: EntityId[] | EntityPredicate<any>
): DidMutate {
  const ids = Array.isArray(idsOrPredicate)
    ? idsOrPredicate
    : state.ids.filter((id) => idsOrPredicate(state.entityMap[id]));
  let didMutate = DidMutate.None;

  for (const id of ids) {
    if (state.entityMap[id]) {
      delete state.entityMap[id];
      didMutate = DidMutate.Both;
    }
  }

  if (didMutate === DidMutate.Both) {
    state.ids = state.ids.filter((id) => id in state.entityMap);
  }

  return didMutate;
}

export function updateEntitiesMutably(
  state: EntityState<any>,
  idsOrPredicate: EntityId[] | EntityPredicate<any>,
  changes: EntityChanges<any>
): DidMutate {
  const ids = Array.isArray(idsOrPredicate)
    ? idsOrPredicate
    : state.ids.filter((id) => idsOrPredicate(state.entityMap[id]));
  let didMutate = DidMutate.None;

  for (const id of ids) {
    const entity = state.entityMap[id];

    if (entity) {
      const changesRecord =
        typeof changes === 'function' ? changes(entity) : changes;
      state.entityMap[id] = { ...entity, ...changesRecord };
      didMutate = DidMutate.Entities;
    }
  }

  return didMutate;
}
