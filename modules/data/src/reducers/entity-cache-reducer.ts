import { Injectable } from '@angular/core';
import { Action, ActionReducer } from '@ngrx/store';

import { EntityAction } from '../actions/entity-action';
import { EntityCache } from './entity-cache';

import {
  EntityCacheAction,
  ClearCollections,
  LoadCollections,
  MergeQuerySet,
  SaveEntities,
  SaveEntitiesCancel,
  SaveEntitiesError,
  SaveEntitiesSuccess,
} from '../actions/entity-cache-action';

import {
  ChangeSetOperation,
  ChangeSetItem,
} from '../actions/entity-cache-change-set';

import { EntityCollection } from './entity-collection';
import { EntityCollectionCreator } from './entity-collection-creator';
import { EntityCollectionReducerRegistry } from './entity-collection-reducer-registry';
import { EntityOp } from '../actions/entity-op';
import { Logger } from '../utils/interfaces';
import { MergeStrategy } from '../actions/merge-strategy';

/**
 * Creates the EntityCacheReducer via its create() method
 */
@Injectable()
export class EntityCacheReducerFactory {
  constructor(
    private entityCollectionCreator: EntityCollectionCreator,
    private entityCollectionReducerRegistry: EntityCollectionReducerRegistry,
    private logger: Logger
  ) {}

  /**
   * Create the @ngrx/data entity cache reducer which either responds to entity cache level actions
   * or (more commonly) delegates to an EntityCollectionReducer based on the action.payload.entityName.
   */
  create(): ActionReducer<EntityCache, Action> {
    // This technique ensures a named function appears in the debugger
    return entityCacheReducer.bind(this);

    function entityCacheReducer(
      this: EntityCacheReducerFactory,
      entityCache: EntityCache = {},
      action: { type: string; payload?: any }
    ): EntityCache {
      // EntityCache actions
      switch (action.type) {
        case EntityCacheAction.CLEAR_COLLECTIONS: {
          return this.clearCollectionsReducer(
            entityCache,
            action as ClearCollections
          );
        }

        case EntityCacheAction.LOAD_COLLECTIONS: {
          return this.loadCollectionsReducer(
            entityCache,
            action as LoadCollections
          );
        }

        case EntityCacheAction.MERGE_QUERY_SET: {
          return this.mergeQuerySetReducer(
            entityCache,
            action as MergeQuerySet
          );
        }

        case EntityCacheAction.SAVE_ENTITIES: {
          return this.saveEntitiesReducer(entityCache, action as SaveEntities);
        }

        case EntityCacheAction.SAVE_ENTITIES_CANCEL: {
          return this.saveEntitiesCancelReducer(
            entityCache,
            action as SaveEntitiesCancel
          );
        }

        case EntityCacheAction.SAVE_ENTITIES_ERROR: {
          return this.saveEntitiesErrorReducer(
            entityCache,
            action as SaveEntitiesError
          );
        }

        case EntityCacheAction.SAVE_ENTITIES_SUCCESS: {
          return this.saveEntitiesSuccessReducer(
            entityCache,
            action as SaveEntitiesSuccess
          );
        }

        case EntityCacheAction.SET_ENTITY_CACHE: {
          // Completely replace the EntityCache. Be careful!
          return action.payload.cache;
        }
      }

      // Apply entity collection reducer if this is a valid EntityAction for a collection
      const payload = action.payload;
      if (payload && payload.entityName && payload.entityOp && !payload.error) {
        return this.applyCollectionReducer(entityCache, action as EntityAction);
      }

      // Not a valid EntityAction
      return entityCache;
    }
  }

  /**
   * Reducer to clear multiple collections at the same time.
   * @param entityCache the entity cache
   * @param action a ClearCollections action whose payload is an array of collection names.
   * If empty array, does nothing. If no array, clears all the collections.
   */
  protected clearCollectionsReducer(
    entityCache: EntityCache,
    action: ClearCollections
  ) {
    // eslint-disable-next-line prefer-const
    let { collections, tag } = action.payload;
    const entityOp = EntityOp.REMOVE_ALL;

    if (!collections) {
      // Collections is not defined. Clear all collections.
      collections = Object.keys(entityCache);
    }

    entityCache = collections.reduce((newCache, entityName) => {
      const payload = { entityName, entityOp };
      const act: EntityAction = {
        type: `[${entityName}] ${action.type}`,
        payload,
      };
      newCache = this.applyCollectionReducer(newCache, act);
      return newCache;
    }, entityCache);
    return entityCache;
  }

  /**
   * Reducer to load collection in the form of a hash of entity data for multiple collections.
   * @param entityCache the entity cache
   * @param action a LoadCollections action whose payload is the QuerySet of entity collections to load
   */
  protected loadCollectionsReducer(
    entityCache: EntityCache,
    action: LoadCollections
  ) {
    const { collections, tag } = action.payload;
    const entityOp = EntityOp.ADD_ALL;
    const entityNames = Object.keys(collections);
    entityCache = entityNames.reduce((newCache, entityName) => {
      const payload = {
        entityName,
        entityOp,
        data: collections[entityName],
      };
      const act: EntityAction = {
        type: `[${entityName}] ${action.type}`,
        payload,
      };
      newCache = this.applyCollectionReducer(newCache, act);
      return newCache;
    }, entityCache);
    return entityCache;
  }

  /**
   * Reducer to merge query sets in the form of a hash of entity data for multiple collections.
   * @param entityCache the entity cache
   * @param action a MergeQuerySet action with the query set and a MergeStrategy
   */
  protected mergeQuerySetReducer(
    entityCache: EntityCache,
    action: MergeQuerySet
  ) {
    // eslint-disable-next-line prefer-const
    let { mergeStrategy, querySet, tag } = action.payload;
    mergeStrategy =
      mergeStrategy === null ? MergeStrategy.PreserveChanges : mergeStrategy;
    const entityOp = EntityOp.QUERY_MANY_SUCCESS;

    const entityNames = Object.keys(querySet);
    entityCache = entityNames.reduce((newCache, entityName) => {
      const payload = {
        entityName,
        entityOp,
        data: querySet[entityName],
        mergeStrategy,
      };
      const act: EntityAction = {
        type: `[${entityName}] ${action.type}`,
        payload,
      };
      newCache = this.applyCollectionReducer(newCache, act);
      return newCache;
    }, entityCache);
    return entityCache;
  }

  // #region saveEntities reducers
  protected saveEntitiesReducer(
    entityCache: EntityCache,
    action: SaveEntities
  ) {
    const { changeSet, correlationId, isOptimistic, mergeStrategy, tag } =
      action.payload;

    try {
      changeSet.changes.forEach((item) => {
        const entityName = item.entityName;
        const payload = {
          entityName,
          entityOp: getEntityOp(item),
          data: item.entities,
          correlationId,
          isOptimistic,
          mergeStrategy,
          tag,
        };

        const act: EntityAction = {
          type: `[${entityName}] ${action.type}`,
          payload,
        };
        entityCache = this.applyCollectionReducer(entityCache, act);
        if (act.payload.error) {
          throw act.payload.error;
        }
      });
    } catch (error: any) {
      action.payload.error = error;
    }

    return entityCache;
    function getEntityOp(item: ChangeSetItem) {
      switch (item.op) {
        case ChangeSetOperation.Add:
          return EntityOp.SAVE_ADD_MANY;
        case ChangeSetOperation.Delete:
          return EntityOp.SAVE_DELETE_MANY;
        case ChangeSetOperation.Update:
          return EntityOp.SAVE_UPDATE_MANY;
        case ChangeSetOperation.Upsert:
          return EntityOp.SAVE_UPSERT_MANY;
      }
    }
  }

  protected saveEntitiesCancelReducer(
    entityCache: EntityCache,
    action: SaveEntitiesCancel
  ) {
    // This implementation can only clear the loading flag for the collections involved
    // If the save was optimistic, you'll have to compensate to fix the cache as you think necessary
    return this.clearLoadingFlags(
      entityCache,
      action.payload.entityNames || []
    );
  }

  protected saveEntitiesErrorReducer(
    entityCache: EntityCache,
    action: SaveEntitiesError
  ) {
    const originalAction = action.payload.originalAction;
    const originalChangeSet = originalAction.payload.changeSet;

    // This implementation can only clear the loading flag for the collections involved
    // If the save was optimistic, you'll have to compensate to fix the cache as you think necessary
    const entityNames = originalChangeSet.changes.map(
      (item) => item.entityName
    );
    return this.clearLoadingFlags(entityCache, entityNames);
  }

  protected saveEntitiesSuccessReducer(
    entityCache: EntityCache,
    action: SaveEntitiesSuccess
  ) {
    const { changeSet, correlationId, isOptimistic, mergeStrategy, tag } =
      action.payload;

    changeSet.changes.forEach((item) => {
      const entityName = item.entityName;
      const payload = {
        entityName,
        entityOp: getEntityOp(item),
        data: item.entities,
        correlationId,
        isOptimistic,
        mergeStrategy,
        tag,
      };

      const act: EntityAction = {
        type: `[${entityName}] ${action.type}`,
        payload,
      };
      entityCache = this.applyCollectionReducer(entityCache, act);
    });

    return entityCache;
    function getEntityOp(item: ChangeSetItem) {
      switch (item.op) {
        case ChangeSetOperation.Add:
          return EntityOp.SAVE_ADD_MANY_SUCCESS;
        case ChangeSetOperation.Delete:
          return EntityOp.SAVE_DELETE_MANY_SUCCESS;
        case ChangeSetOperation.Update:
          return EntityOp.SAVE_UPDATE_MANY_SUCCESS;
        case ChangeSetOperation.Upsert:
          return EntityOp.SAVE_UPSERT_MANY_SUCCESS;
      }
    }
  }
  // #endregion saveEntities reducers

  // #region helpers
  /** Apply reducer for the action's EntityCollection (if the action targets a collection) */
  private applyCollectionReducer(
    cache: EntityCache = {},
    action: EntityAction
  ) {
    const entityName = action.payload.entityName;
    const collection = cache[entityName];
    const reducer =
      this.entityCollectionReducerRegistry.getOrCreateReducer(entityName);

    let newCollection: EntityCollection;
    try {
      newCollection = collection
        ? reducer(collection, action)
        : reducer(this.entityCollectionCreator.create(entityName), action);
    } catch (error: any) {
      this.logger.error(error);
      action.payload.error = error;
    }

    return action.payload.error || collection === newCollection!
      ? cache
      : { ...cache, [entityName]: newCollection! };
  }

  /** Ensure loading is false for every collection in entityNames */
  private clearLoadingFlags(entityCache: EntityCache, entityNames: string[]) {
    let isMutated = false;
    entityNames.forEach((entityName) => {
      const collection = entityCache[entityName];
      if (collection.loading) {
        if (!isMutated) {
          entityCache = { ...entityCache };
          isMutated = true;
        }
        entityCache[entityName] = { ...collection, loading: false };
      }
    });
    return entityCache;
  }
  // #endregion helpers
}
