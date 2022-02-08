import { Action, createSelector, Store } from '@ngrx/store';
import { IdSelector, Update } from '@ngrx/entity';

import { Observable, of, throwError } from 'rxjs';
import {
  filter,
  map,
  mergeMap,
  shareReplay,
  withLatestFrom,
  take,
} from 'rxjs/operators';

import { CorrelationIdGenerator } from '../utils/correlation-id-generator';
import { defaultSelectId, toUpdateFactory } from '../utils/utilities';
import { EntityAction, EntityActionOptions } from '../actions/entity-action';
import { EntityActionFactory } from '../actions/entity-action-factory';
import { EntityActionGuard } from '../actions/entity-action-guard';
import { EntityCache } from '../reducers/entity-cache';
import { EntityCacheSelector } from '../selectors/entity-cache-selector';
import { EntityCollection } from '../reducers/entity-collection';
import { EntityCommands } from './entity-commands';
import { EntityDispatcher, PersistanceCanceled } from './entity-dispatcher';
import { EntityDispatcherDefaultOptions } from './entity-dispatcher-default-options';
import { EntityOp, OP_ERROR, OP_SUCCESS } from '../actions/entity-op';
import { MergeStrategy } from '../actions/merge-strategy';
import { QueryParams } from '../dataservices/interfaces';
import { UpdateResponseData } from '../actions/update-response-data';

/**
 * Dispatches EntityCollection actions to their reducers and effects (default implementation).
 * All save commands rely on an Ngrx Effect such as `EntityEffects.persist$`.
 */
export class EntityDispatcherBase<T> implements EntityDispatcher<T> {
  /** Utility class with methods to validate EntityAction payloads.*/
  guard: EntityActionGuard<T>;

  private entityCollection$: Observable<EntityCollection<T>>;

  /**
   * Convert an entity (or partial entity) into the `Update<T>` object
   * `update...` and `upsert...` methods take `Update<T>` args
   */
  toUpdate: (entity: Partial<T>) => Update<T>;

  constructor(
    /** Name of the entity type for which entities are dispatched */
    public entityName: string,
    /** Creates an {EntityAction} */
    public entityActionFactory: EntityActionFactory,
    /** The store, scoped to the EntityCache */
    public store: Store<EntityCache>,
    /** Returns the primary key (id) of this entity */
    public selectId: IdSelector<T> = defaultSelectId,
    /**
     * Dispatcher options configure dispatcher behavior such as
     * whether add is optimistic or pessimistic by default.
     */
    private defaultDispatcherOptions: EntityDispatcherDefaultOptions,
    /** Actions scanned by the store after it processed them with reducers. */
    private reducedActions$: Observable<Action>,
    /** Store selector for the EntityCache */
    entityCacheSelector: EntityCacheSelector,
    /** Generates correlation ids for query and save methods */
    private correlationIdGenerator: CorrelationIdGenerator
  ) {
    this.guard = new EntityActionGuard(entityName, selectId);
    this.toUpdate = toUpdateFactory<T>(selectId);

    const collectionSelector = createSelector(
      entityCacheSelector,
      (cache) => cache[entityName] as EntityCollection<T>
    );
    this.entityCollection$ = store.select(collectionSelector);
  }

  /**
   * Create an {EntityAction} for this entity type.
   * @param entityOp {EntityOp} the entity operation
   * @param [data] the action data
   * @param [options] additional options
   * @returns the EntityAction
   */
  createEntityAction<P = any>(
    entityOp: EntityOp,
    data?: P,
    options?: EntityActionOptions
  ): EntityAction<P> {
    return this.entityActionFactory.create({
      entityName: this.entityName,
      entityOp,
      data,
      ...options,
    });
  }

  /**
   * Create an {EntityAction} for this entity type and
   * dispatch it immediately to the store.
   * @param op {EntityOp} the entity operation
   * @param [data] the action data
   * @param [options] additional options
   * @returns the dispatched EntityAction
   */
  createAndDispatch<P = any>(
    op: EntityOp,
    data?: P,
    options?: EntityActionOptions
  ): EntityAction<P> {
    const action = this.createEntityAction(op, data, options);
    this.dispatch(action);
    return action;
  }

  /**
   * Dispatch an Action to the store.
   * @param action the Action
   * @returns the dispatched Action
   */
  dispatch(action: Action): Action {
    this.store.dispatch(action);
    return action;
  }

  // #region Query and save operations

  /**
   * Dispatch action to save a new entity to remote storage.
   * @param entity entity to add, which may omit its key if pessimistic and the server creates the key;
   * must have a key if optimistic save.
   * @returns A terminating Observable of the entity
   * after server reports successful save or the save error.
   */
  add(entity: T, options?: EntityActionOptions): Observable<T> {
    options = this.setSaveEntityActionOptions(
      options,
      this.defaultDispatcherOptions.optimisticAdd
    );
    const action = this.createEntityAction(
      EntityOp.SAVE_ADD_ONE,
      entity,
      options
    );
    if (options.isOptimistic) {
      this.guard.mustBeEntity(action);
    }
    this.dispatch(action);
    return this.getResponseData$<T>(options.correlationId).pipe(
      // Use the returned entity data's id to get the entity from the collection
      // as it might be different from the entity returned from the server.
      withLatestFrom(this.entityCollection$),
      map(([e, collection]) => collection.entities[this.selectId(e)]!),
      shareReplay(1)
    );
  }

  /**
   * Dispatch action to cancel the persistence operation (query or save).
   * Will cause save observable to error with a PersistenceCancel error.
   * Caller is responsible for undoing changes in cache from pending optimistic save
   * @param correlationId The correlation id for the corresponding EntityAction
   * @param [reason] explains why canceled and by whom.
   */
  cancel(
    correlationId: any,
    reason?: string,
    options?: EntityActionOptions
  ): void {
    if (!correlationId) {
      throw new Error('Missing correlationId');
    }
    this.createAndDispatch(EntityOp.CANCEL_PERSIST, reason, { correlationId });
  }

  /**
   * Dispatch action to delete entity from remote storage by key.
   * @param key The primary key of the entity to remove
   * @returns A terminating Observable of the deleted key
   * after server reports successful save or the save error.
   */
  delete(entity: T, options?: EntityActionOptions): Observable<number | string>;

  /**
   * Dispatch action to delete entity from remote storage by key.
   * @param key The entity to delete
   * @returns A terminating Observable of the deleted key
   * after server reports successful save or the save error.
   */
  delete(
    key: number | string,
    options?: EntityActionOptions
  ): Observable<number | string>;
  delete(
    arg: number | string | T,
    options?: EntityActionOptions
  ): Observable<number | string> {
    options = this.setSaveEntityActionOptions(
      options,
      this.defaultDispatcherOptions.optimisticDelete
    );
    const key = this.getKey(arg);
    const action = this.createEntityAction(
      EntityOp.SAVE_DELETE_ONE,
      key,
      options
    );
    this.guard.mustBeKey(action);
    this.dispatch(action);
    return this.getResponseData$<number | string>(options.correlationId).pipe(
      map(() => key),
      shareReplay(1)
    );
  }

  /**
   * Dispatch action to query remote storage for all entities and
   * merge the queried entities into the cached collection.
   * @returns A terminating Observable of the queried entities that are in the collection
   * after server reports success query or the query error.
   * @see load()
   */
  getAll(options?: EntityActionOptions): Observable<T[]> {
    options = this.setQueryEntityActionOptions(options);
    const action = this.createEntityAction(EntityOp.QUERY_ALL, null, options);
    this.dispatch(action);
    return this.getResponseData$<T[]>(options.correlationId).pipe(
      // Use the returned entity ids to get the entities from the collection
      // as they might be different from the entities returned from the server
      // because of unsaved changes (deletes or updates).
      withLatestFrom(this.entityCollection$),
      map(([entities, collection]) =>
        entities.reduce((acc, e) => {
          const entity = collection.entities[this.selectId(e)];
          if (entity) {
            acc.push(entity); // only return an entity found in the collection
          }
          return acc;
        }, [] as T[])
      ),
      shareReplay(1)
    );
  }

  /**
   * Dispatch action to query remote storage for the entity with this primary key.
   * If the server returns an entity,
   * merge it into the cached collection.
   * @returns A terminating Observable of the collection
   * after server reports successful query or the query error.
   */
  getByKey(key: any, options?: EntityActionOptions): Observable<T> {
    options = this.setQueryEntityActionOptions(options);
    const action = this.createEntityAction(EntityOp.QUERY_BY_KEY, key, options);
    this.dispatch(action);
    return this.getResponseData$<T>(options.correlationId).pipe(
      // Use the returned entity data's id to get the entity from the collection
      // as it might be different from the entity returned from the server.
      withLatestFrom(this.entityCollection$),
      map(
        ([entity, collection]) => collection.entities[this.selectId(entity)]!
      ),
      shareReplay(1)
    );
  }

  /**
   * Dispatch action to query remote storage for the entities that satisfy a query expressed
   * with either a query parameter map or an HTTP URL query string,
   * and merge the results into the cached collection.
   * @param queryParams the query in a form understood by the server
   * @returns A terminating Observable of the queried entities
   * after server reports successful query or the query error.
   */
  getWithQuery(
    queryParams: QueryParams | string,
    options?: EntityActionOptions
  ): Observable<T[]> {
    options = this.setQueryEntityActionOptions(options);
    const action = this.createEntityAction(
      EntityOp.QUERY_MANY,
      queryParams,
      options
    );
    this.dispatch(action);
    return this.getResponseData$<T[]>(options.correlationId).pipe(
      // Use the returned entity ids to get the entities from the collection
      // as they might be different from the entities returned from the server
      // because of unsaved changes (deletes or updates).
      withLatestFrom(this.entityCollection$),
      map(([entities, collection]) =>
        entities.reduce((acc, e) => {
          const entity = collection.entities[this.selectId(e)];
          if (entity) {
            acc.push(entity); // only return an entity found in the collection
          }
          return acc;
        }, [] as T[])
      ),
      shareReplay(1)
    );
  }

  /**
   * Dispatch action to query remote storage for all entities and
   * completely replace the cached collection with the queried entities.
   * @returns A terminating Observable of the entities in the collection
   * after server reports successful query or the query error.
   * @see getAll
   */
  load(options?: EntityActionOptions): Observable<T[]> {
    options = this.setQueryEntityActionOptions(options);
    const action = this.createEntityAction(EntityOp.QUERY_LOAD, null, options);
    this.dispatch(action);
    return this.getResponseData$<T[]>(options.correlationId).pipe(
      shareReplay(1)
    );
  }

  /**
   * Dispatch action to save the updated entity (or partial entity) in remote storage.
   * The update entity may be partial (but must have its key)
   * in which case it patches the existing entity.
   * @param entity update entity, which might be a partial of T but must at least have its key.
   * @returns A terminating Observable of the updated entity
   * after server reports successful save or the save error.
   */
  update(entity: Partial<T>, options?: EntityActionOptions): Observable<T> {
    // update entity might be a partial of T but must at least have its key.
    // pass the Update<T> structure as the payload
    const update = this.toUpdate(entity);
    options = this.setSaveEntityActionOptions(
      options,
      this.defaultDispatcherOptions.optimisticUpdate
    );
    const action = this.createEntityAction(
      EntityOp.SAVE_UPDATE_ONE,
      update,
      options
    );
    if (options.isOptimistic) {
      this.guard.mustBeUpdate(action);
    }
    this.dispatch(action);
    return this.getResponseData$<UpdateResponseData<T>>(
      options.correlationId
    ).pipe(
      // Use the update entity data id to get the entity from the collection
      // as might be different from the entity returned from the server
      // because the id changed or there are unsaved changes.
      map((updateData) => updateData.changes),
      withLatestFrom(this.entityCollection$),
      map(([e, collection]) => collection.entities[this.selectId(e as T)]!),
      shareReplay(1)
    );
  }

  /**
   * Dispatch action to save a new or existing entity to remote storage.
   * Only dispatch this action if your server supports upsert.
   * @param entity entity to add, which may omit its key if pessimistic and the server creates the key;
   * must have a key if optimistic save.
   * @returns A terminating Observable of the entity
   * after server reports successful save or the save error.
   */
  upsert(entity: T, options?: EntityActionOptions): Observable<T> {
    options = this.setSaveEntityActionOptions(
      options,
      this.defaultDispatcherOptions.optimisticUpsert
    );
    const action = this.createEntityAction(
      EntityOp.SAVE_UPSERT_ONE,
      entity,
      options
    );
    if (options.isOptimistic) {
      this.guard.mustBeEntity(action);
    }
    this.dispatch(action);
    return this.getResponseData$<T>(options.correlationId).pipe(
      // Use the returned entity data's id to get the entity from the collection
      // as it might be different from the entity returned from the server.
      withLatestFrom(this.entityCollection$),
      map(([e, collection]) => collection.entities[this.selectId(e)]!),
      shareReplay(1)
    );
  }
  // #endregion Query and save operations

  // #region Cache-only operations that do not update remote storage

  // Unguarded for performance.
  // EntityCollectionReducer<T> runs a guard (which throws)
  // Developer should understand cache-only methods well enough
  // to call them with the proper entities.
  // May reconsider and add guards in future.

  /**
   * Replace all entities in the cached collection.
   * Does not save to remote storage.
   */
  addAllToCache(entities: T[], options?: EntityActionOptions): void {
    this.createAndDispatch(EntityOp.ADD_ALL, entities, options);
  }

  /**
   * Add a new entity directly to the cache.
   * Does not save to remote storage.
   * Ignored if an entity with the same primary key is already in cache.
   */
  addOneToCache(entity: T, options?: EntityActionOptions): void {
    this.createAndDispatch(EntityOp.ADD_ONE, entity, options);
  }

  /**
   * Add multiple new entities directly to the cache.
   * Does not save to remote storage.
   * Entities with primary keys already in cache are ignored.
   */
  addManyToCache(entities: T[], options?: EntityActionOptions): void {
    this.createAndDispatch(EntityOp.ADD_MANY, entities, options);
  }

  /** Clear the cached entity collection */
  clearCache(options?: EntityActionOptions): void {
    this.createAndDispatch(EntityOp.REMOVE_ALL, undefined, options);
  }

  /**
   * Remove an entity directly from the cache.
   * Does not delete that entity from remote storage.
   * @param entity The entity to remove
   */
  removeOneFromCache(entity: T, options?: EntityActionOptions): void;

  /**
   * Remove an entity directly from the cache.
   * Does not delete that entity from remote storage.
   * @param key The primary key of the entity to remove
   */
  removeOneFromCache(key: number | string, options?: EntityActionOptions): void;
  removeOneFromCache(
    arg: (number | string) | T,
    options?: EntityActionOptions
  ): void {
    this.createAndDispatch(EntityOp.REMOVE_ONE, this.getKey(arg), options);
  }

  /**
   * Remove multiple entities directly from the cache.
   * Does not delete these entities from remote storage.
   * @param entity The entities to remove
   */
  removeManyFromCache(entities: T[], options?: EntityActionOptions): void;

  /**
   * Remove multiple entities directly from the cache.
   * Does not delete these entities from remote storage.
   * @param keys The primary keys of the entities to remove
   */
  removeManyFromCache(
    keys: (number | string)[],
    options?: EntityActionOptions
  ): void;
  removeManyFromCache(
    args: (number | string)[] | T[],
    options?: EntityActionOptions
  ): void {
    if (!args || args.length === 0) {
      return;
    }
    const keys =
      typeof args[0] === 'object'
        ? // if array[0] is a key, assume they're all keys
          (<T[]>args).map((arg) => this.getKey(arg))
        : args;
    this.createAndDispatch(EntityOp.REMOVE_MANY, keys, options);
  }

  /**
   * Update a cached entity directly.
   * Does not update that entity in remote storage.
   * Ignored if an entity with matching primary key is not in cache.
   * The update entity may be partial (but must have its key)
   * in which case it patches the existing entity.
   */
  updateOneInCache(entity: Partial<T>, options?: EntityActionOptions): void {
    // update entity might be a partial of T but must at least have its key.
    // pass the Update<T> structure as the payload
    const update: Update<T> = this.toUpdate(entity);
    this.createAndDispatch(EntityOp.UPDATE_ONE, update, options);
  }

  /**
   * Update multiple cached entities directly.
   * Does not update these entities in remote storage.
   * Entities whose primary keys are not in cache are ignored.
   * Update entities may be partial but must at least have their keys.
   * such partial entities patch their cached counterparts.
   */
  updateManyInCache(
    entities: Partial<T>[],
    options?: EntityActionOptions
  ): void {
    if (!entities || entities.length === 0) {
      return;
    }
    const updates: Update<T>[] = entities.map((entity) =>
      this.toUpdate(entity)
    );
    this.createAndDispatch(EntityOp.UPDATE_MANY, updates, options);
  }

  /**
   * Add or update a new entity directly to the cache.
   * Does not save to remote storage.
   * Upsert entity might be a partial of T but must at least have its key.
   * Pass the Update<T> structure as the payload
   */
  upsertOneInCache(entity: Partial<T>, options?: EntityActionOptions): void {
    this.createAndDispatch(EntityOp.UPSERT_ONE, entity, options);
  }

  /**
   * Add or update multiple cached entities directly.
   * Does not save to remote storage.
   */
  upsertManyInCache(
    entities: Partial<T>[],
    options?: EntityActionOptions
  ): void {
    if (!entities || entities.length === 0) {
      return;
    }
    this.createAndDispatch(EntityOp.UPSERT_MANY, entities, options);
  }

  /**
   * Set the pattern that the collection's filter applies
   * when using the `filteredEntities` selector.
   */
  setFilter(pattern: any): void {
    this.createAndDispatch(EntityOp.SET_FILTER, pattern);
  }

  /** Set the loaded flag */
  setLoaded(isLoaded: boolean): void {
    this.createAndDispatch(EntityOp.SET_LOADED, !!isLoaded);
  }

  /** Set the loading flag */
  setLoading(isLoading: boolean): void {
    this.createAndDispatch(EntityOp.SET_LOADING, !!isLoading);
  }
  // #endregion Cache-only operations that do not update remote storage

  // #region private helpers

  /** Get key from entity (unless arg is already a key) */
  private getKey(arg: number | string | T) {
    return typeof arg === 'object'
      ? this.selectId(arg)
      : (arg as number | string);
  }

  /**
   * Return Observable of data from the server-success EntityAction with
   * the given Correlation Id, after that action was processed by the ngrx store.
   * or else put the server error on the Observable error channel.
   * @param crid The correlationId for both the save and response actions.
   */
  private getResponseData$<D = any>(crid: any): Observable<D> {
    /**
     * reducedActions$ must be replay observable of the most recent action reduced by the store.
     * because the response action might have been dispatched to the store
     * before caller had a chance to subscribe.
     */
    return this.reducedActions$.pipe(
      filter((act: any) => !!act.payload),
      filter((act: EntityAction) => {
        const { correlationId, entityName, entityOp } = act.payload;
        return (
          entityName === this.entityName &&
          correlationId === crid &&
          (entityOp.endsWith(OP_SUCCESS) ||
            entityOp.endsWith(OP_ERROR) ||
            entityOp === EntityOp.CANCEL_PERSIST)
        );
      }),
      take(1),
      mergeMap((act) => {
        const { entityOp } = act.payload;
        return entityOp === EntityOp.CANCEL_PERSIST
          ? throwError(() => new PersistanceCanceled(act.payload.data))
          : entityOp.endsWith(OP_SUCCESS)
          ? of(act.payload.data as D)
          : throwError(() => act.payload.data.error);
      })
    );
  }

  private setQueryEntityActionOptions(
    options?: EntityActionOptions
  ): EntityActionOptions {
    options = options || {};
    const correlationId =
      options.correlationId == null
        ? this.correlationIdGenerator.next()
        : options.correlationId;
    return { ...options, correlationId };
  }

  private setSaveEntityActionOptions(
    options?: EntityActionOptions,
    defaultOptimism?: boolean
  ): EntityActionOptions {
    options = options || {};
    const correlationId =
      options.correlationId == null
        ? this.correlationIdGenerator.next()
        : options.correlationId;
    const isOptimistic =
      options.isOptimistic == null
        ? defaultOptimism || false
        : options.isOptimistic === true;
    return { ...options, correlationId, isOptimistic };
  }
  // #endregion private helpers
}
