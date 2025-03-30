import {
  DidMutate,
  EntityChanges,
  EntityId,
  EntityPredicate,
  EntityState,
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
  selectId: SelectEntityId<any>,
  prepend = false
): DidMutate {
  const id = selectId(entity);

  if (state.entityMap[id]) {
    return DidMutate.None;
  }

  state.entityMap[id] = entity;

  if (prepend) {
    state.ids.unshift(id);
  } else {
    state.ids.push(id);
  }

  return DidMutate.Both;
}

export function addEntitiesMutably(
  state: EntityState<any>,
  entities: any[],
  selectId: SelectEntityId<any>,
  prepend = false
): DidMutate {
  let didMutate = DidMutate.None;

  for (const entity of entities) {
    const result = addEntityMutably(state, entity, selectId, prepend);

    if (result === DidMutate.Both) {
      didMutate = result;
    }
  }

  return didMutate;
}

export function setEntityMutably(
  state: EntityState<any>,
  entity: any,
  selectId: SelectEntityId<any>,
  replace = true
): DidMutate {
  const id = selectId(entity);

  if (state.entityMap[id]) {
    state.entityMap[id] = replace
      ? entity
      : { ...state.entityMap[id], ...entity };

    return DidMutate.Entities;
  }

  state.entityMap[id] = entity;
  state.ids.push(id);

  return DidMutate.Both;
}

export function setEntitiesMutably(
  state: EntityState<any>,
  entities: any[],
  selectId: SelectEntityId<any>,
  replace = true
): DidMutate {
  let didMutate = DidMutate.None;

  for (const entity of entities) {
    const result = setEntityMutably(state, entity, selectId, replace);

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
  changes: EntityChanges<any>,
  selectId: SelectEntityId<any>
): DidMutate {
  const ids = Array.isArray(idsOrPredicate)
    ? idsOrPredicate
    : state.ids.filter((id) => idsOrPredicate(state.entityMap[id]));
  let newIds: Record<EntityId, EntityId> | undefined = undefined;
  let didMutate = DidMutate.None;

  for (const id of ids) {
    const entity = state.entityMap[id];

    if (entity) {
      const changesRecord =
        typeof changes === 'function' ? changes(entity) : changes;
      state.entityMap[id] = { ...entity, ...changesRecord };
      didMutate = DidMutate.Entities;

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
    didMutate = DidMutate.Both;
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

  return didMutate;
}
