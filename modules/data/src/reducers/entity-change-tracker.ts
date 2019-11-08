import { Update } from '@ngrx/entity';
import { EntityCollection } from './entity-collection';
import { MergeStrategy } from '../actions/merge-strategy';
import { UpdateResponseData } from '../actions/update-response-data';

/**
 * Methods for tracking, committing, and reverting/undoing unsaved entity changes.
 * Used by EntityCollectionReducerMethods which should call tracker methods BEFORE modifying the collection.
 * See EntityChangeTracker docs.
 */
export interface EntityChangeTracker<T> {
  // #region commit
  /**
   * Commit all changes as when the collection has been completely reloaded from the server.
   * Harmless when there are no entity changes to commit.
   * @param collection The entity collection
   */
  commitAll(collection: EntityCollection<T>): EntityCollection<T>;

  /**
   * Commit changes for the given entities as when they have been refreshed from the server.
   * Harmless when there are no entity changes to commit.
   * @param entityOrIdList The entities to clear tracking or their ids.
   * @param collection The entity collection
   */
  commitMany(
    entityOrIdList: (number | string | T)[],
    collection: EntityCollection<T>
  ): EntityCollection<T>;

  /**
   * Commit changes for the given entity as when it have been refreshed from the server.
   * Harmless when no entity changes to commit.
   * @param entityOrId The entity to clear tracking or its id.
   * @param collection The entity collection
   */
  commitOne(
    entityOrId: number | string | T,
    collection: EntityCollection<T>
  ): EntityCollection<T>;
  // #endregion commit

  // #region mergeQuery
  /**
   * Merge query results into the collection, adjusting the ChangeState per the mergeStrategy.
   * @param entities Entities returned from querying the server.
   * @param collection The entity collection
   * @param [mergeStrategy] How to merge a queried entity when the corresponding entity in the collection has an unsaved change.
   * If not specified, implementation supplies a default strategy.
   * @returns The merged EntityCollection.
   */
  mergeQueryResults(
    entities: T[],
    collection: EntityCollection<T>,
    mergeStrategy?: MergeStrategy
  ): EntityCollection<T>;
  // #endregion mergeQuery

  // #region mergeSave
  /**
   * Merge result of saving new entities into the collection, adjusting the ChangeState per the mergeStrategy.
   * The default is MergeStrategy.OverwriteChanges.
   * @param entities Entities returned from saving new entities to the server.
   * @param collection The entity collection
   * @param [mergeStrategy] How to merge a saved entity when the corresponding entity in the collection has an unsaved change.
   * If not specified, implementation supplies a default strategy.
   * @returns The merged EntityCollection.
   */
  mergeSaveAdds(
    entities: T[],
    collection: EntityCollection<T>,
    mergeStrategy?: MergeStrategy
  ): EntityCollection<T>;
  /**
   * Merge successful result of deleting entities on the server that have the given primary keys
   * Clears the entity changeState for those keys unless the MergeStrategy is ignoreChanges.
   * @param entities keys primary keys of the entities to remove/delete.
   * @param collection The entity collection
   * @param [mergeStrategy] How to adjust change tracking when the corresponding entity in the collection has an unsaved change.
   * If not specified, implementation supplies a default strategy.
   * @returns The merged EntityCollection.
   */
  mergeSaveDeletes(
    keys: (number | string)[],
    collection: EntityCollection<T>,
    mergeStrategy?: MergeStrategy
  ): EntityCollection<T>;

  /**
   * Merge result of saving upserted entities into the collection, adjusting the ChangeState per the mergeStrategy.
   * The default is MergeStrategy.OverwriteChanges.
   * @param entities Entities returned from saving upsert entities to the server.
   * @param collection The entity collection
   * @param [mergeStrategy] How to merge a saved entity when the corresponding entity in the collection has an unsaved change.
   * If not specified, implementation supplies a default strategy.
   * @returns The merged EntityCollection.
   */
  mergeSaveUpserts(
    entities: T[],
    collection: EntityCollection<T>,
    mergeStrategy?: MergeStrategy
  ): EntityCollection<T>;

  /**
   * Merge result of saving updated entities into the collection, adjusting the ChangeState per the mergeStrategy.
   * The default is MergeStrategy.OverwriteChanges.
   * @param updates Entity response data returned from saving updated entities to the server.
   * @param [mergeStrategy] How to merge a saved entity when the corresponding entity in the collection has an unsaved change.
   * If not specified, implementation supplies a default strategy.
   * @param [skipUnchanged] True means skip update if server didn't change it. False by default.
   * If the update was optimistic and the server didn't make more changes of its own
   * then the updates are already in the collection and shouldn't make them again.
   * @param collection The entity collection
   * @returns The merged EntityCollection.
   */
  mergeSaveUpdates(
    updates: UpdateResponseData<T>[],
    collection: EntityCollection<T>,
    mergeStrategy?: MergeStrategy,
    skipUnchanged?: boolean
  ): EntityCollection<T>;
  // #endregion mergeSave

  // #region track
  /**
   * Track multiple entities before adding them to the collection.
   * Does NOT add to the collection (the reducer's job).
   * @param entities The entities to add. They must all have their ids.
   * @param collection The entity collection
   * @param [mergeStrategy] Track by default. Don't track if is MergeStrategy.IgnoreChanges.
   * If not specified, implementation supplies a default strategy.
   */
  trackAddMany(
    entities: T[],
    collection: EntityCollection<T>,
    mergeStrategy?: MergeStrategy
  ): EntityCollection<T>;

  /**
   * Track an entity before adding it to the collection.
   * Does NOT add to the collection (the reducer's job).
   * @param entity The entity to add. It must have an id.
   * @param collection The entity collection
   * @param [mergeStrategy] Track by default. Don't track if is MergeStrategy.IgnoreChanges.
   * If not specified, implementation supplies a default strategy.
   */
  trackAddOne(
    entity: T,
    collection: EntityCollection<T>,
    mergeStrategy?: MergeStrategy
  ): EntityCollection<T>;

  /**
   * Track multiple entities before removing them with the intention of deleting them on the server.
   * Does NOT remove from the collection (the reducer's job).
   * @param keys The primary keys of the entities to delete.
   * @param collection The entity collection
   * @param [mergeStrategy] Track by default. Don't track if is MergeStrategy.IgnoreChanges.
   */
  trackDeleteMany(
    keys: (number | string)[],
    collection: EntityCollection<T>,
    mergeStrategy?: MergeStrategy
  ): EntityCollection<T>;

  /**
   * Track an entity before it is removed with the intention of deleting it on the server.
   * Does NOT remove from the collection (the reducer's job).
   * @param key The primary key of the entity to delete.
   * @param collection The entity collection
   * @param [mergeStrategy] Track by default. Don't track if is MergeStrategy.IgnoreChanges.
   */
  trackDeleteOne(
    key: number | string,
    collection: EntityCollection<T>,
    mergeStrategy?: MergeStrategy
  ): EntityCollection<T>;

  /**
   * Track multiple entities before updating them in the collection.
   * Does NOT update the collection (the reducer's job).
   * @param updates The entities to update.
   * @param collection The entity collection
   * @param [mergeStrategy] Track by default. Don't track if is MergeStrategy.IgnoreChanges.
   */
  trackUpdateMany(
    updates: Update<T>[],
    collection: EntityCollection<T>,
    mergeStrategy?: MergeStrategy
  ): EntityCollection<T>;

  /**
   * Track an entity before updating it in the collection.
   * Does NOT update the collection (the reducer's job).
   * @param update The entity to update.
   * @param collection The entity collection
   * @param [mergeStrategy] Track by default. Don't track if is MergeStrategy.IgnoreChanges.
   */
  trackUpdateOne(
    update: Update<T>,
    collection: EntityCollection<T>,
    mergeStrategy?: MergeStrategy
  ): EntityCollection<T>;

  /**
   * Track multiple entities before upserting (adding and updating) them to the collection.
   * Does NOT update the collection (the reducer's job).
   * @param entities The entities to add or update. They must be complete entities with ids.
   * @param collection The entity collection
   * @param [mergeStrategy] Track by default. Don't track if is MergeStrategy.IgnoreChanges.
   */
  trackUpsertMany(
    entities: T[],
    collection: EntityCollection<T>,
    mergeStrategy?: MergeStrategy
  ): EntityCollection<T>;

  /**
   * Track an entity before upsert (adding and updating) it to the collection.
   * Does NOT update the collection (the reducer's job).
   * @param entities The entity to add or update. It must be a complete entity with its id.
   * @param collection The entity collection
   * @param [mergeStrategy] Track by default. Don't track if is MergeStrategy.IgnoreChanges.
   */
  trackUpsertOne(
    entity: T,
    collection: EntityCollection<T>,
    mergeStrategy?: MergeStrategy
  ): EntityCollection<T>;
  // #endregion track

  // #region undo
  /**
   * Revert the unsaved changes for all collection.
   * Harmless when there are no entity changes to undo.
   * @param collection The entity collection
   */
  undoAll(collection: EntityCollection<T>): EntityCollection<T>;

  /**
   * Revert the unsaved changes for the given entities.
   * Harmless when there are no entity changes to undo.
   * @param entityOrIdList The entities to revert or their ids.
   * @param collection The entity collection
   */
  undoMany(
    entityOrIdList: (number | string | T)[],
    collection: EntityCollection<T>
  ): EntityCollection<T>;

  /**
   * Revert the unsaved changes for the given entity.
   * Harmless when there are no entity changes to undo.
   * @param entityOrId The entity to revert or its id.
   * @param collection The entity collection
   */
  undoOne(
    entityOrId: number | string | T,
    collection: EntityCollection<T>
  ): EntityCollection<T>;
  // #endregion undo
}
