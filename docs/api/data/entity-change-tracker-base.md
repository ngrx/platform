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

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/reducers/entity-change-tracker-base.ts#L15-L741)

## Methods

### commitAll

#### description (#commitAll-description)

Commit all changes as when the collection has been completely reloaded from the server.
Harmless when there are no entity changes to commit.

```ts
commitAll(collection: EntityCollection<T>): EntityCollection<T>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/reducers/entity-change-tracker-base.ts#L30-L34)

#### Parameters (#commitAll-parameters)

| Name       | Type                  | Description           |
| ---------- | --------------------- | --------------------- |
| collection | `EntityCollection<T>` | The entity collection |

### commitMany

#### description (#commitMany-description)

Commit changes for the given entities as when they have been refreshed from the server.
Harmless when there are no entity changes to commit.

```ts
commitMany(  entityOrIdList: (number | string | T)[],  collection: EntityCollection<T> ): EntityCollection<T>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/reducers/entity-change-tracker-base.ts#L42-L66)

#### Parameters (#commitMany-parameters)

| Name           | Type                      | Description                                  |
| -------------- | ------------------------- | -------------------------------------------- |
| entityOrIdList | `(string | number | T)[]` | The entities to clear tracking or their ids. |
| collection     | `EntityCollection<T>`     | The entity collection                        |

### commitOne

#### description (#commitOne-description)

Commit changes for the given entity as when it have been refreshed from the server.
Harmless when no entity changes to commit.

```ts
commitOne(  entityOrId: number | string | T,  collection: EntityCollection<T> ): EntityCollection<T>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/reducers/entity-change-tracker-base.ts#L74-L81)

#### Parameters (#commitOne-parameters)

| Name       | Type                  | Description                             |
| ---------- | --------------------- | --------------------------------------- |
| entityOrId | `string | number | T` | The entity to clear tracking or its id. |
| collection | `EntityCollection<T>` | The entity collection                   |

### mergeQueryResults

#### description (#mergeQueryResults-description)

Merge query results into the collection, adjusting the ChangeState per the mergeStrategy.

```ts
mergeQueryResults(  entities: T[],  collection: EntityCollection<T>,  mergeStrategy?: MergeStrategy ): EntityCollection<T>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/reducers/entity-change-tracker-base.ts#L94-L105)

#### Parameters (#mergeQueryResults-parameters)

| Name            | Type                                                                                                      | Description                                 |
| --------------- | --------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| entities        | `T[]`                                                                                                     | Entities returned from querying the server. |
| collection      | `EntityCollection<T>`                                                                                     | The entity collection                       |
| [mergeStrategy] | `` | How to merge a queried entity when the corresponding entity in the collection has an unsaved change. |
| mergeStrategy   | `MergeStrategy`                                                                                           |                                             |

#### returns (#mergeQueryResults-returns)

The merged EntityCollection.

### mergeSaveAdds

#### description (#mergeSaveAdds-description)

Merge result of saving new entities into the collection, adjusting the ChangeState per the mergeStrategy.
The default is MergeStrategy.OverwriteChanges.

```ts
mergeSaveAdds(  entities: T[],  collection: EntityCollection<T>,  mergeStrategy?: MergeStrategy ): EntityCollection<T>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/reducers/entity-change-tracker-base.ts#L118-L129)

#### Parameters (#mergeSaveAdds-parameters)

| Name            | Type                                                                                                    | Description                                               |
| --------------- | ------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| entities        | `T[]`                                                                                                   | Entities returned from saving new entities to the server. |
| collection      | `EntityCollection<T>`                                                                                   | The entity collection                                     |
| [mergeStrategy] | `` | How to merge a saved entity when the corresponding entity in the collection has an unsaved change. |
| mergeStrategy   | `MergeStrategy`                                                                                         |                                                           |

#### returns (#mergeSaveAdds-returns)

The merged EntityCollection.

### mergeSaveDeletes

#### description (#mergeSaveDeletes-description)

Merge successful result of deleting entities on the server that have the given primary keys
Clears the entity changeState for those keys unless the MergeStrategy is ignoreChanges.

```ts
mergeSaveDeletes(  keys: (number | string)[],  collection: EntityCollection<T>,  mergeStrategy?: MergeStrategy ): EntityCollection<T>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/reducers/entity-change-tracker-base.ts#L140-L154)

#### Parameters (#mergeSaveDeletes-parameters)

| Name            | Type                                                                                                      | Description           |
| --------------- | --------------------------------------------------------------------------------------------------------- | --------------------- |
| entities        | `` | keys primary keys of the entities to remove/delete.                                                  |
| collection      | `EntityCollection<T>`                                                                                     | The entity collection |
| [mergeStrategy] | `` | How to adjust change tracking when the corresponding entity in the collection has an unsaved change. |
| keys            | `(string | number)[]`                                                                                     |                       |
| mergeStrategy   | `MergeStrategy`                                                                                           |                       |

#### returns (#mergeSaveDeletes-returns)

The merged EntityCollection.

### mergeSaveUpdates

#### description (#mergeSaveUpdates-description)

Merge result of saving updated entities into the collection, adjusting the ChangeState per the mergeStrategy.
The default is MergeStrategy.OverwriteChanges.

```ts
mergeSaveUpdates(  updateResponseData: UpdateResponseData<T>[],  collection: EntityCollection<T>,  mergeStrategy?: MergeStrategy,  skipUnchanged = false ): EntityCollection<T>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/reducers/entity-change-tracker-base.ts#L168-L263)

#### Parameters (#mergeSaveUpdates-parameters)

| Name               | Type                                                                                                    | Description                                                               |
| ------------------ | ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| updateResponseData | `UpdateResponseData<T>[]`                                                                               | Entity response data returned from saving updated entities to the server. |
| collection         | `EntityCollection<T>`                                                                                   | The entity collection                                                     |
| [mergeStrategy]    | `` | How to merge a saved entity when the corresponding entity in the collection has an unsaved change. |
| [skipUnchanged]    | `` | True means skip update if server didn't change it. False by default.                               |
| mergeStrategy      | `MergeStrategy`                                                                                         |                                                                           |
| skipUnchanged      | `boolean`                                                                                               |                                                                           |

#### returns (#mergeSaveUpdates-returns)

The merged EntityCollection.

### mergeSaveUpserts

#### description (#mergeSaveUpserts-description)

Merge result of saving upserted entities into the collection, adjusting the ChangeState per the mergeStrategy.
The default is MergeStrategy.OverwriteChanges.

```ts
mergeSaveUpserts(  entities: T[],  collection: EntityCollection<T>,  mergeStrategy?: MergeStrategy ): EntityCollection<T>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/reducers/entity-change-tracker-base.ts#L274-L285)

#### Parameters (#mergeSaveUpserts-parameters)

| Name            | Type                                                                                                    | Description                                          |
| --------------- | ------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| entities        | `T[]`                                                                                                   | Entities returned from saving upserts to the server. |
| collection      | `EntityCollection<T>`                                                                                   | The entity collection                                |
| [mergeStrategy] | `` | How to merge a saved entity when the corresponding entity in the collection has an unsaved change. |
| mergeStrategy   | `MergeStrategy`                                                                                         |                                                      |

#### returns (#mergeSaveUpserts-returns)

The merged EntityCollection.

### trackAddMany

#### description (#trackAddMany-description)

Track multiple entities before adding them to the collection.
Does NOT add to the collection (the reducer's job).

```ts
trackAddMany(  entities: T[],  collection: EntityCollection<T>,  mergeStrategy?: MergeStrategy ): EntityCollection<T>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/reducers/entity-change-tracker-base.ts#L370-L402)

#### Parameters (#trackAddMany-parameters)

| Name            | Type                                                                  | Description                                        |
| --------------- | --------------------------------------------------------------------- | -------------------------------------------------- |
| entities        | `T[]`                                                                 | The entities to add. They must all have their ids. |
| collection      | `EntityCollection<T>`                                                 | The entity collection                              |
| [mergeStrategy] | `` | Track by default. Don't track if is MergeStrategy.IgnoreChanges. |
| mergeStrategy   | `MergeStrategy`                                                       |                                                    |

### trackAddOne

#### description (#trackAddOne-description)

Track an entity before adding it to the collection.
Does NOT add to the collection (the reducer's job).

```ts
trackAddOne(  entity: T,  collection: EntityCollection<T>,  mergeStrategy?: MergeStrategy ): EntityCollection<T>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/reducers/entity-change-tracker-base.ts#L412-L420)

#### Parameters (#trackAddOne-parameters)

| Name            | Type                                                                  | Description                            |
| --------------- | --------------------------------------------------------------------- | -------------------------------------- |
| entity          | `T`                                                                   | The entity to add. It must have an id. |
| collection      | `EntityCollection<T>`                                                 | The entity collection                  |
| [mergeStrategy] | `` | Track by default. Don't track if is MergeStrategy.IgnoreChanges. |
| mergeStrategy   | `MergeStrategy`                                                       |                                        |

### trackDeleteMany

#### description (#trackDeleteMany-description)

Track multiple entities before removing them with the intention of deleting them on the server.
Does NOT remove from the collection (the reducer's job).

```ts
trackDeleteMany(  keys: (number | string)[],  collection: EntityCollection<T>,  mergeStrategy?: MergeStrategy ): EntityCollection<T>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/reducers/entity-change-tracker-base.ts#L429-L476)

#### Parameters (#trackDeleteMany-parameters)

| Name            | Type                                                                  | Description                                 |
| --------------- | --------------------------------------------------------------------- | ------------------------------------------- |
| keys            | `(string | number)[]`                                                 | The primary keys of the entities to delete. |
| collection      | `EntityCollection<T>`                                                 | The entity collection                       |
| [mergeStrategy] | `` | Track by default. Don't track if is MergeStrategy.IgnoreChanges. |
| mergeStrategy   | `MergeStrategy`                                                       |                                             |

### trackDeleteOne

#### description (#trackDeleteOne-description)

Track an entity before it is removed with the intention of deleting it on the server.
Does NOT remove from the collection (the reducer's job).

```ts
trackDeleteOne(  key: number | string,  collection: EntityCollection<T>,  mergeStrategy?: MergeStrategy ): EntityCollection<T>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/reducers/entity-change-tracker-base.ts#L485-L493)

#### Parameters (#trackDeleteOne-parameters)

| Name            | Type                                                                  | Description                              |
| --------------- | --------------------------------------------------------------------- | ---------------------------------------- |
| key             | `string | number`                                                     | The primary key of the entity to delete. |
| collection      | `EntityCollection<T>`                                                 | The entity collection                    |
| [mergeStrategy] | `` | Track by default. Don't track if is MergeStrategy.IgnoreChanges. |
| mergeStrategy   | `MergeStrategy`                                                       |                                          |

### trackUpdateMany

#### description (#trackUpdateMany-description)

Track multiple entities before updating them in the collection.
Does NOT update the collection (the reducer's job).

```ts
trackUpdateMany(  updates: Update<T>[],  collection: EntityCollection<T>,  mergeStrategy?: MergeStrategy ): EntityCollection<T>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/reducers/entity-change-tracker-base.ts#L502-L540)

#### Parameters (#trackUpdateMany-parameters)

| Name            | Type                                                                  | Description             |
| --------------- | --------------------------------------------------------------------- | ----------------------- |
| updates         | `any[]`                                                               | The entities to update. |
| collection      | `EntityCollection<T>`                                                 | The entity collection   |
| [mergeStrategy] | `` | Track by default. Don't track if is MergeStrategy.IgnoreChanges. |
| mergeStrategy   | `MergeStrategy`                                                       |                         |

### trackUpdateOne

#### description (#trackUpdateOne-description)

Track an entity before updating it in the collection.
Does NOT update the collection (the reducer's job).

```ts
trackUpdateOne(  update: Update<T>,  collection: EntityCollection<T>,  mergeStrategy?: MergeStrategy ): EntityCollection<T>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/reducers/entity-change-tracker-base.ts#L549-L557)

#### Parameters (#trackUpdateOne-parameters)

| Name            | Type                                                                  | Description           |
| --------------- | --------------------------------------------------------------------- | --------------------- |
| update          | `any`                                                                 | The entity to update. |
| collection      | `EntityCollection<T>`                                                 | The entity collection |
| [mergeStrategy] | `` | Track by default. Don't track if is MergeStrategy.IgnoreChanges. |
| mergeStrategy   | `MergeStrategy`                                                       |                       |

### trackUpsertMany

#### description (#trackUpsertMany-description)

Track multiple entities before upserting (adding and updating) them to the collection.
Does NOT update the collection (the reducer's job).

```ts
trackUpsertMany(  entities: T[],  collection: EntityCollection<T>,  mergeStrategy?: MergeStrategy ): EntityCollection<T>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/reducers/entity-change-tracker-base.ts#L566-L604)

#### Parameters (#trackUpsertMany-parameters)

| Name            | Type                                                                  | Description                                                             |
| --------------- | --------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| entities        | `T[]`                                                                 | The entities to add or update. They must be complete entities with ids. |
| collection      | `EntityCollection<T>`                                                 | The entity collection                                                   |
| [mergeStrategy] | `` | Track by default. Don't track if is MergeStrategy.IgnoreChanges. |
| mergeStrategy   | `MergeStrategy`                                                       |                                                                         |

### trackUpsertOne

#### description (#trackUpsertOne-description)

Track an entity before upsert (adding and updating) it to the collection.
Does NOT update the collection (the reducer's job).

```ts
trackUpsertOne(  entity: T,  collection: EntityCollection<T>,  mergeStrategy?: MergeStrategy ): EntityCollection<T>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/reducers/entity-change-tracker-base.ts#L613-L621)

#### Parameters (#trackUpsertOne-parameters)

| Name            | Type                                                                        | Description           |
| --------------- | --------------------------------------------------------------------------- | --------------------- |
| entities        | `` | The entity to add or update. It must be a complete entity with its id. |
| collection      | `EntityCollection<T>`                                                       | The entity collection |
| [mergeStrategy] | `` | Track by default. Don't track if is MergeStrategy.IgnoreChanges.       |
| entity          | `T`                                                                         |                       |
| mergeStrategy   | `MergeStrategy`                                                             |                       |

### undoAll

#### description (#undoAll-description)

Revert the unsaved changes for all collection.
Harmless when there are no entity changes to undo.

```ts
undoAll(collection: EntityCollection<T>): EntityCollection<T>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/reducers/entity-change-tracker-base.ts#L630-L664)

#### Parameters (#undoAll-parameters)

| Name       | Type                  | Description           |
| ---------- | --------------------- | --------------------- |
| collection | `EntityCollection<T>` | The entity collection |

### undoMany

#### description (#undoMany-description)

Revert the unsaved changes for the given entities.
Harmless when there are no entity changes to undo.

```ts
undoMany(  entityOrIdList: (number | string | T)[],  collection: EntityCollection<T> ): EntityCollection<T>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/reducers/entity-change-tracker-base.ts#L672-L724)

#### Parameters (#undoMany-parameters)

| Name           | Type                      | Description                          |
| -------------- | ------------------------- | ------------------------------------ |
| entityOrIdList | `(string | number | T)[]` | The entities to revert or their ids. |
| collection     | `EntityCollection<T>`     | The entity collection                |

### undoOne

#### description (#undoOne-description)

Revert the unsaved changes for the given entity.
Harmless when there are no entity changes to undo.

```ts
undoOne(  entityOrId: number | string | T,  collection: EntityCollection<T> ): EntityCollection<T>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/reducers/entity-change-tracker-base.ts#L732-L739)

#### Parameters (#undoOne-parameters)

| Name       | Type                  | Description                     |
| ---------- | --------------------- | ------------------------------- |
| entityOrId | `string | number | T` | The entity to revert or its id. |
| collection | `EntityCollection<T>` | The entity collection           |
