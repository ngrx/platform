---
kind: ClassDeclaration
name: EntityChangeTrackerBase
module: data
---

# EntityChangeTrackerBase

## description

The default implementation of EntityChangeTracker with
methods for tracking, committing, and reverting/undoing unsaved entity changes.
Used by EntityCollectionReducerMethods which should call tracker methods BEFORE modifying the collection.
See EntityChangeTracker docs.

```ts
class EntityChangeTrackerBase<T> implements EntityChangeTracker<T> {
  commitAll(collection: EntityCollection<T>): EntityCollection<T>;
  commitMany(
    entityOrIdList: (number | string | T)[],
    collection: EntityCollection<T>
  ): EntityCollection<T>;
  commitOne(
    entityOrId: number | string | T,
    collection: EntityCollection<T>
  ): EntityCollection<T>;
  mergeQueryResults(
    entities: T[],
    collection: EntityCollection<T>,
    mergeStrategy?: MergeStrategy
  ): EntityCollection<T>;
  mergeSaveAdds(
    entities: T[],
    collection: EntityCollection<T>,
    mergeStrategy?: MergeStrategy
  ): EntityCollection<T>;
  mergeSaveDeletes(
    keys: (number | string)[],
    collection: EntityCollection<T>,
    mergeStrategy?: MergeStrategy
  ): EntityCollection<T>;
  mergeSaveUpdates(
    updateResponseData: UpdateResponseData<T>[],
    collection: EntityCollection<T>,
    mergeStrategy?: MergeStrategy,
    skipUnchanged = false
  ): EntityCollection<T>;
  mergeSaveUpserts(
    entities: T[],
    collection: EntityCollection<T>,
    mergeStrategy?: MergeStrategy
  ): EntityCollection<T>;
  trackAddMany(
    entities: T[],
    collection: EntityCollection<T>,
    mergeStrategy?: MergeStrategy
  ): EntityCollection<T>;
  trackAddOne(
    entity: T,
    collection: EntityCollection<T>,
    mergeStrategy?: MergeStrategy
  ): EntityCollection<T>;
  trackDeleteMany(
    keys: (number | string)[],
    collection: EntityCollection<T>,
    mergeStrategy?: MergeStrategy
  ): EntityCollection<T>;
  trackDeleteOne(
    key: number | string,
    collection: EntityCollection<T>,
    mergeStrategy?: MergeStrategy
  ): EntityCollection<T>;
  trackUpdateMany(
    updates: Update<T>[],
    collection: EntityCollection<T>,
    mergeStrategy?: MergeStrategy
  ): EntityCollection<T>;
  trackUpdateOne(
    update: Update<T>,
    collection: EntityCollection<T>,
    mergeStrategy?: MergeStrategy
  ): EntityCollection<T>;
  trackUpsertMany(
    entities: T[],
    collection: EntityCollection<T>,
    mergeStrategy?: MergeStrategy
  ): EntityCollection<T>;
  trackUpsertOne(
    entity: T,
    collection: EntityCollection<T>,
    mergeStrategy?: MergeStrategy
  ): EntityCollection<T>;
  undoAll(collection: EntityCollection<T>): EntityCollection<T>;
  undoMany(
    entityOrIdList: (number | string | T)[],
    collection: EntityCollection<T>
  ): EntityCollection<T>;
  undoOne(
    entityOrId: number | string | T,
    collection: EntityCollection<T>
  ): EntityCollection<T>;
}
```
