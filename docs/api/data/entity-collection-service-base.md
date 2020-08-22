---
kind: ClassDeclaration
name: EntityCollectionServiceBase
module: data
---

# EntityCollectionServiceBase

## description

Base class for a concrete EntityCollectionService<T>.
Can be instantiated. Cannot be injected. Use EntityCollectionServiceFactory to create.

```ts
class EntityCollectionServiceBase<
  T,
  S$ extends EntitySelectors$<T> = EntitySelectors$<T>
> implements EntityCollectionService<T> {
  readonly dispatcher: EntityDispatcher<T>;
  readonly selectors: EntitySelectors<T>;
  readonly selectors$: S$;
  guard: EntityActionGuard<T>;
  selectId: IdSelector<T>;
  toUpdate: (entity: Partial<T>) => Update<T>;
  collection$: Observable<EntityCollection<T>> | Store<EntityCollection<T>>;
  count$: Observable<number> | Store<number>;
  entities$: Observable<T[]> | Store<T[]>;
  entityActions$: Observable<EntityAction>;
  entityMap$: Observable<Dictionary<T>> | Store<Dictionary<T>>;
  errors$: Observable<EntityAction>;
  filter$: Observable<any> | Store<any>;
  filteredEntities$: Observable<T[]> | Store<T[]>;
  keys$: Observable<string[] | number[]> | Store<string[] | number[]>;
  loaded$: Observable<boolean> | Store<boolean>;
  loading$: Observable<boolean> | Store<boolean>;
  changeState$: Observable<ChangeStateMap<T>> | Store<ChangeStateMap<T>>;

  createEntityAction<P = any>(
    op: EntityOp,
    data?: P,
    options?: EntityActionOptions
  ): EntityAction<P>;
  createAndDispatch<P = any>(
    op: EntityOp,
    data?: P,
    options?: EntityActionOptions
  ): EntityAction<P>;
  dispatch(action: Action): Action;
  add(entity: T, options?: EntityActionOptions): Observable<T>;
  cancel(
    correlationId: any,
    reason?: string,
    options?: EntityActionOptions
  ): void;
  delete(
    arg: number | string | T,
    options?: EntityActionOptions
  ): Observable<number | string>;
  delete(entity: T, options?: EntityActionOptions): Observable<number | string>;
  delete(
    key: number | string,
    options?: EntityActionOptions
  ): Observable<number | string>;
  getAll(options?: EntityActionOptions): Observable<T[]>;
  getByKey(key: any, options?: EntityActionOptions): Observable<T>;
  getWithQuery(
    queryParams: QueryParams | string,
    options?: EntityActionOptions
  ): Observable<T[]>;
  load(options?: EntityActionOptions): Observable<T[]>;
  update(entity: Partial<T>, options?: EntityActionOptions): Observable<T>;
  upsert(entity: T, options?: EntityActionOptions): Observable<T>;
  addAllToCache(entities: T[], options?: EntityActionOptions): void;
  addOneToCache(entity: T, options?: EntityActionOptions): void;
  addManyToCache(entities: T[], options?: EntityActionOptions): void;
  clearCache(): void;
  removeOneFromCache(
    arg: (number | string) | T,
    options?: EntityActionOptions
  ): void;
  removeOneFromCache(entity: T, options?: EntityActionOptions): void;
  removeOneFromCache(key: number | string, options?: EntityActionOptions): void;
  removeManyFromCache(
    args: (number | string)[] | T[],
    options?: EntityActionOptions
  ): void;
  removeManyFromCache(entities: T[], options?: EntityActionOptions): void;
  removeManyFromCache(
    keys: (number | string)[],
    options?: EntityActionOptions
  ): void;
  updateOneInCache(entity: Partial<T>, options?: EntityActionOptions): void;
  updateManyInCache(
    entities: Partial<T>[],
    options?: EntityActionOptions
  ): void;
  upsertOneInCache(entity: Partial<T>, options?: EntityActionOptions): void;
  upsertManyInCache(
    entities: Partial<T>[],
    options?: EntityActionOptions
  ): void;
  setFilter(pattern: any): void;
  setLoaded(isLoaded: boolean): void;
  setLoading(isLoading: boolean): void;
}
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/entity-services/entity-collection-service-base.ts#L28-L471)

## Parameters

| Name                            | Type                                  | Description |
| ------------------------------- | ------------------------------------- | ----------- |
| EntityCollectionServiceElements | `` | The ingredients for this service |

## Methods

### createEntityAction

#### description (#createEntityAction-description)

Create an {EntityAction} for this entity type.

```ts
createEntityAction<P = any>(  op: EntityOp,  data?: P,  options?: EntityActionOptions ): EntityAction<P>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/entity-services/entity-collection-service-base.ts#L82-L88)

#### Parameters (#createEntityAction-parameters)

| Name      | Type                    | Description                     |
| --------- | ----------------------- | ------------------------------- |
| op        | `EntityOp`              | {EntityOp} the entity operation |
| [data]    | `` | the action data    |
| [options] | `` | additional options |
| data      | `P`                     |                                 |
| options   | `EntityActionOptions`   |                                 |

#### returns (#createEntityAction-returns)

the EntityAction

### createAndDispatch

#### description (#createAndDispatch-description)

Create an {EntityAction} for this entity type and
dispatch it immediately to the store.

```ts
createAndDispatch<P = any>(  op: EntityOp,  data?: P,  options?: EntityActionOptions ): EntityAction<P>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/entity-services/entity-collection-service-base.ts#L98-L104)

#### Parameters (#createAndDispatch-parameters)

| Name      | Type                    | Description                     |
| --------- | ----------------------- | ------------------------------- |
| op        | `EntityOp`              | {EntityOp} the entity operation |
| [data]    | `` | the action data    |
| [options] | `` | additional options |
| data      | `P`                     |                                 |
| options   | `EntityActionOptions`   |                                 |

#### returns (#createAndDispatch-returns)

the dispatched EntityAction

### dispatch

#### description (#dispatch-description)

Dispatch an action of any type to the ngrx store.

```ts
dispatch(action: Action): Action;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/entity-services/entity-collection-service-base.ts#L111-L113)

#### Parameters (#dispatch-parameters)

| Name   | Type  | Description |
| ------ | ----- | ----------- |
| action | `any` | the Action  |

#### returns (#dispatch-returns)

the dispatched Action

### add

#### description (#add-description)

Dispatch action to save a new entity to remote storage.

```ts
add(entity: T, options?: EntityActionOptions): Observable<T>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/entity-services/entity-collection-service-base.ts#L144-L146)

#### Parameters (#add-parameters)

| Name      | Type                                                | Description                                                                          |
| --------- | --------------------------------------------------- | ------------------------------------------------------------------------------------ |
| entity    | `T`                                                 | entity to add, which may omit its key if pessimistic and the server creates the key; |
| [options] | `` | options that influence save and merge behavior |
| options   | `EntityActionOptions`                               |                                                                                      |

#### returns (#add-returns)

Observable of the entity
after server reports successful save or the save error.

### cancel

#### description (#cancel-description)

Dispatch action to cancel the persistence operation (query or save) with the given correlationId.

```ts
cancel(  correlationId: any,  reason?: string,  options?: EntityActionOptions ): void;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/entity-services/entity-collection-service-base.ts#L154-L160)

#### Parameters (#cancel-parameters)

| Name          | Type                                           | Description                                           |
| ------------- | ---------------------------------------------- | ----------------------------------------------------- |
| correlationId | `any`                                          | The correlation id for the corresponding EntityAction |
| [reason]      | `` | explains why canceled and by whom.        |
| [options]     | `` | options such as the tag and mergeStrategy |
| reason        | `string`                                       |                                                       |
| options       | `EntityActionOptions`                          |                                                       |

### delete

```ts
delete(  arg: number | string | T,  options?: EntityActionOptions ): Observable<number | string>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/entity-services/entity-collection-service-base.ts#L182-L187)

#### Parameters (#delete-parameters)

| Name    | Type                  | Description |
| ------- | --------------------- | ----------- |
| arg     | `string | number | T` |             |
| options | `EntityActionOptions` |             |

### delete

#### description (#delete-description)

Dispatch action to delete entity from remote storage by key.

```ts
delete(entity: T, options?: EntityActionOptions): Observable<number | string>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/entity-services/entity-collection-service-base.ts#L169-L169)

#### Parameters (#delete-parameters)

| Name      | Type                                                | Description |
| --------- | --------------------------------------------------- | ----------- |
| key       | `` | The entity to delete                           |
| [options] | `` | options that influence save and merge behavior |
| entity    | `T`                                                 |             |
| options   | `EntityActionOptions`                               |             |

#### returns (#delete-returns)

Observable of the deleted key
after server reports successful save or the save error.

### delete

#### description (#delete-description)

Dispatch action to delete entity from remote storage by key.

```ts
delete(  key: number | string,  options?: EntityActionOptions ): Observable<number | string>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/entity-services/entity-collection-service-base.ts#L178-L181)

#### Parameters (#delete-parameters)

| Name      | Type                                                | Description                             |
| --------- | --------------------------------------------------- | --------------------------------------- |
| key       | `string | number`                                   | The primary key of the entity to remove |
| [options] | `` | options that influence save and merge behavior |
| options   | `EntityActionOptions`                               |                                         |

#### returns (#delete-returns)

Observable of the deleted key
after server reports successful save or the save error.

### getAll

#### description (#getAll-description)

Dispatch action to query remote storage for all entities and
merge the queried entities into the cached collection.

```ts
getAll(options?: EntityActionOptions): Observable<T[]>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/entity-services/entity-collection-service-base.ts#L197-L199)

#### Parameters (#getAll-parameters)

| Name      | Type                                       | Description |
| --------- | ------------------------------------------ | ----------- |
| [options] | `` | options that influence merge behavior |
| options   | `EntityActionOptions`                      |             |

#### returns (#getAll-returns)

Observable of the collection
after server reports successful query or the query error.

#### see (#getAll-see)

load()

### getByKey

#### description (#getByKey-description)

Dispatch action to query remote storage for the entity with this primary key.
If the server returns an entity,
merge it into the cached collection.

```ts
getByKey(key: any, options?: EntityActionOptions): Observable<T>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/entity-services/entity-collection-service-base.ts#L210-L212)

#### Parameters (#getByKey-parameters)

| Name      | Type                                       | Description                           |
| --------- | ------------------------------------------ | ------------------------------------- |
| key       | `any`                                      | The primary key of the entity to get. |
| [options] | `` | options that influence merge behavior |
| options   | `EntityActionOptions`                      |                                       |

#### returns (#getByKey-returns)

Observable of the queried entity that is in the collection
after server reports success or the query error.

### getWithQuery

#### description (#getWithQuery-description)

Dispatch action to query remote storage for the entities that satisfy a query expressed
with either a query parameter map or an HTTP URL query string,
and merge the results into the cached collection.

```ts
getWithQuery(  queryParams: QueryParams | string,  options?: EntityActionOptions ): Observable<T[]>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/entity-services/entity-collection-service-base.ts#L223-L228)

#### Parameters (#getWithQuery-parameters)

| Name        | Type                                       | Description                                  |
| ----------- | ------------------------------------------ | -------------------------------------------- |
| queryParams | `string | QueryParams`                     | the query in a form understood by the server |
| [options]   | `` | options that influence merge behavior |
| options     | `EntityActionOptions`                      |                                              |

#### returns (#getWithQuery-returns)

Observable of the queried entities
after server reports successful query or the query error.

### load

#### description (#load-description)

Dispatch action to query remote storage for all entities and
completely replace the cached collection with the queried entities.

```ts
load(options?: EntityActionOptions): Observable<T[]>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/entity-services/entity-collection-service-base.ts#L238-L240)

#### Parameters (#load-parameters)

| Name      | Type                                      | Description |
| --------- | ----------------------------------------- | ----------- |
| [options] | `` | options that influence load behavior |
| options   | `EntityActionOptions`                     |             |

#### returns (#load-returns)

Observable of the collection
after server reports successful query or the query error.

#### see (#load-see)

getAll

### update

#### description (#update-description)

Dispatch action to save the updated entity (or partial entity) in remote storage.
The update entity may be partial (but must have its key)
in which case it patches the existing entity.

```ts
update(entity: Partial<T>, options?: EntityActionOptions): Observable<T>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/entity-services/entity-collection-service-base.ts#L251-L253)

#### Parameters (#update-parameters)

| Name      | Type                                                | Description                                                                  |
| --------- | --------------------------------------------------- | ---------------------------------------------------------------------------- |
| entity    | `Partial<T>`                                        | update entity, which might be a partial of T but must at least have its key. |
| [options] | `` | options that influence save and merge behavior |
| options   | `EntityActionOptions`                               |                                                                              |

#### returns (#update-returns)

Observable of the updated entity
after server reports successful save or the save error.

### upsert

#### description (#upsert-description)

Dispatch action to save a new or existing entity to remote storage.
Call only if the server supports upsert.

```ts
upsert(entity: T, options?: EntityActionOptions): Observable<T>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/entity-services/entity-collection-service-base.ts#L265-L267)

#### Parameters (#upsert-parameters)

| Name      | Type                                                | Description              |
| --------- | --------------------------------------------------- | ------------------------ |
| entity    | `T`                                                 | entity to add or upsert. |
| [options] | `` | options that influence save and merge behavior |
| options   | `EntityActionOptions`                               |                          |

#### returns (#upsert-returns)

Observable of the entity
after server reports successful save or the save error.

### addAllToCache

#### description (#addAllToCache-description)

Replace all entities in the cached collection.
Does not save to remote storage.

```ts
addAllToCache(entities: T[], options?: EntityActionOptions): void;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/entity-services/entity-collection-service-base.ts#L277-L279)

#### Parameters (#addAllToCache-parameters)

| Name      | Type                               | Description               |
| --------- | ---------------------------------- | ------------------------- |
| entities  | `T[]`                              | to add directly to cache. |
| [options] | `` | options such as mergeStrategy |
| options   | `EntityActionOptions`              |                           |

### addOneToCache

#### description (#addOneToCache-description)

Add a new entity directly to the cache.
Does not save to remote storage.
Ignored if an entity with the same primary key is already in cache.

```ts
addOneToCache(entity: T, options?: EntityActionOptions): void;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/entity-services/entity-collection-service-base.ts#L288-L290)

#### Parameters (#addOneToCache-parameters)

| Name      | Type                               | Description               |
| --------- | ---------------------------------- | ------------------------- |
| entity    | `T`                                | to add directly to cache. |
| [options] | `` | options such as mergeStrategy |
| options   | `EntityActionOptions`              |                           |

### addManyToCache

#### description (#addManyToCache-description)

Add multiple new entities directly to the cache.
Does not save to remote storage.
Entities with primary keys already in cache are ignored.

```ts
addManyToCache(entities: T[], options?: EntityActionOptions): void;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/entity-services/entity-collection-service-base.ts#L299-L301)

#### Parameters (#addManyToCache-parameters)

| Name      | Type                               | Description               |
| --------- | ---------------------------------- | ------------------------- |
| entities  | `T[]`                              | to add directly to cache. |
| [options] | `` | options such as mergeStrategy |
| options   | `EntityActionOptions`              |                           |

### clearCache

```ts
clearCache(): void;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/entity-services/entity-collection-service-base.ts#L304-L306)

### removeOneFromCache

```ts
removeOneFromCache(  arg: (number | string) | T,  options?: EntityActionOptions ): void;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/entity-services/entity-collection-service-base.ts#L323-L328)

#### Parameters (#removeOneFromCache-parameters)

| Name    | Type                  | Description |
| ------- | --------------------- | ----------- |
| arg     | `string | number | T` |             |
| options | `EntityActionOptions` |             |

### removeOneFromCache

#### description (#removeOneFromCache-description)

Remove an entity directly from the cache.
Does not delete that entity from remote storage.

```ts
removeOneFromCache(entity: T, options?: EntityActionOptions): void;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/entity-services/entity-collection-service-base.ts#L314-L314)

#### Parameters (#removeOneFromCache-parameters)

| Name      | Type                               | Description          |
| --------- | ---------------------------------- | -------------------- |
| entity    | `T`                                | The entity to remove |
| [options] | `` | options such as mergeStrategy |
| options   | `EntityActionOptions`              |                      |

### removeOneFromCache

#### description (#removeOneFromCache-description)

Remove an entity directly from the cache.
Does not delete that entity from remote storage.

```ts
removeOneFromCache(key: number | string, options?: EntityActionOptions): void;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/entity-services/entity-collection-service-base.ts#L322-L322)

#### Parameters (#removeOneFromCache-parameters)

| Name      | Type                               | Description                             |
| --------- | ---------------------------------- | --------------------------------------- |
| key       | `string | number`                  | The primary key of the entity to remove |
| [options] | `` | options such as mergeStrategy |
| options   | `EntityActionOptions`              |                                         |

### removeManyFromCache

```ts
removeManyFromCache(  args: (number | string)[] | T[],  options?: EntityActionOptions ): void;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/entity-services/entity-collection-service-base.ts#L348-L353)

#### Parameters (#removeManyFromCache-parameters)

| Name    | Type                        | Description |
| ------- | --------------------------- | ----------- |
| args    | `(string | number)[] | T[]` |             |
| options | `EntityActionOptions`       |             |

### removeManyFromCache

#### description (#removeManyFromCache-description)

Remove multiple entities directly from the cache.
Does not delete these entities from remote storage.

```ts
removeManyFromCache(entities: T[], options?: EntityActionOptions): void;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/entity-services/entity-collection-service-base.ts#L336-L336)

#### Parameters (#removeManyFromCache-parameters)

| Name      | Type                               | Description |
| --------- | ---------------------------------- | ----------- |
| entity    | `` | The entities to remove        |
| [options] | `` | options such as mergeStrategy |
| entities  | `T[]`                              |             |
| options   | `EntityActionOptions`              |             |

### removeManyFromCache

#### description (#removeManyFromCache-description)

Remove multiple entities directly from the cache.
Does not delete these entities from remote storage.

```ts
removeManyFromCache(  keys: (number | string)[],  options?: EntityActionOptions ): void;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/entity-services/entity-collection-service-base.ts#L344-L347)

#### Parameters (#removeManyFromCache-parameters)

| Name      | Type                               | Description                                |
| --------- | ---------------------------------- | ------------------------------------------ |
| keys      | `(string | number)[]`              | The primary keys of the entities to remove |
| [options] | `` | options such as mergeStrategy |
| options   | `EntityActionOptions`              |                                            |

### updateOneInCache

#### description (#updateOneInCache-description)

Update a cached entity directly.
Does not update that entity in remote storage.
Ignored if an entity with matching primary key is not in cache.
The update entity may be partial (but must have its key)
in which case it patches the existing entity.

```ts
updateOneInCache(entity: Partial<T>, options?: EntityActionOptions): void;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/entity-services/entity-collection-service-base.ts#L364-L368)

#### Parameters (#updateOneInCache-parameters)

| Name      | Type                               | Description                  |
| --------- | ---------------------------------- | ---------------------------- |
| entity    | `Partial<T>`                       | to update directly in cache. |
| [options] | `` | options such as mergeStrategy |
| options   | `EntityActionOptions`              |                              |

### updateManyInCache

#### description (#updateManyInCache-description)

Update multiple cached entities directly.
Does not update these entities in remote storage.
Entities whose primary keys are not in cache are ignored.
Update entities may be partial but must at least have their keys.
such partial entities patch their cached counterparts.

```ts
updateManyInCache(  entities: Partial<T>[],  options?: EntityActionOptions ): void;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/entity-services/entity-collection-service-base.ts#L379-L384)

#### Parameters (#updateManyInCache-parameters)

| Name      | Type                               | Description                  |
| --------- | ---------------------------------- | ---------------------------- |
| entities  | `Partial<T>[]`                     | to update directly in cache. |
| [options] | `` | options such as mergeStrategy |
| options   | `EntityActionOptions`              |                              |

### upsertOneInCache

#### description (#upsertOneInCache-description)

Insert or update a cached entity directly.
Does not save to remote storage.
Upsert entity might be a partial of T but must at least have its key.
Pass the Update<T> structure as the payload.

```ts
upsertOneInCache(entity: Partial<T>, options?: EntityActionOptions): void;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/entity-services/entity-collection-service-base.ts#L394-L396)

#### Parameters (#upsertOneInCache-parameters)

| Name      | Type                               | Description                  |
| --------- | ---------------------------------- | ---------------------------- |
| entity    | `Partial<T>`                       | to upsert directly in cache. |
| [options] | `` | options such as mergeStrategy |
| options   | `EntityActionOptions`              |                              |

### upsertManyInCache

#### description (#upsertManyInCache-description)

Insert or update multiple cached entities directly.
Does not save to remote storage.
Upsert entities might be partial but must at least have their keys.
Pass an array of the Update<T> structure as the payload.

```ts
upsertManyInCache(  entities: Partial<T>[],  options?: EntityActionOptions ): void;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/entity-services/entity-collection-service-base.ts#L406-L411)

#### Parameters (#upsertManyInCache-parameters)

| Name      | Type                               | Description                  |
| --------- | ---------------------------------- | ---------------------------- |
| entities  | `Partial<T>[]`                     | to upsert directly in cache. |
| [options] | `` | options such as mergeStrategy |
| options   | `EntityActionOptions`              |                              |

### setFilter

#### description (#setFilter-description)

Set the pattern that the collection's filter applies
when using the `filteredEntities` selector.

```ts
setFilter(pattern: any): void;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/entity-services/entity-collection-service-base.ts#L417-L419)

#### Parameters (#setFilter-parameters)

| Name    | Type  | Description |
| ------- | ----- | ----------- |
| pattern | `any` |             |

### setLoaded

```ts
setLoaded(isLoaded: boolean): void;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/entity-services/entity-collection-service-base.ts#L422-L424)

#### Parameters (#setLoaded-parameters)

| Name     | Type      | Description |
| -------- | --------- | ----------- |
| isLoaded | `boolean` |             |

### setLoading

```ts
setLoading(isLoading: boolean): void;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/entity-services/entity-collection-service-base.ts#L427-L429)

#### Parameters (#setLoading-parameters)

| Name      | Type      | Description |
| --------- | --------- | ----------- |
| isLoading | `boolean` |             |

## Parameters

| Name        | Type                   | Description                                                           |
| ----------- | ---------------------- | --------------------------------------------------------------------- |
| dispatcher  | `EntityDispatcher<T>`  | /\*_ Dispatcher of EntityCommands (EntityActions) _/                  |
| selectors   | `EntitySelectors<T>`   | /\*_ All selectors of entity collection properties _/                 |
| selectors\$ | `S$`                   | /\*_ All selectors\$ (observables of entity collection properties) _/ |
| guard       | `EntityActionGuard<T>` | /\*\*                                                                 |

- Utility class with methods to validate EntityAction payloads.
  _/ |
  | selectId | `any` | /\*\* Returns the primary key (id) of this entity _/ |
  | toUpdate | `(entity: Partial<T>) => any` | /\*\*
- Convert an entity (or partial entity) into the `Update<T>` object
- `update...` and `upsert...` methods take `Update<T>` args
  _/ |
  | collection\$ | `any` | /\*\* Observable of the collection as a whole _/ |
  | count\$ | `any` | /** Observable of count of entities in the cached collection. \*/ |
  | entities\$ | `any` | /** Observable of all entities in the cached collection. _/ |
  | entityActions\$ | `Observable<EntityAction<any>>` | /\*\* Observable of actions related to this entity type. _/ |
  | entityMap\$ | `any` | /** Observable of the map of entity keys to entities \*/ |
  | errors\$ | `Observable<EntityAction<any>>` | /** Observable of error actions related to this entity type. _/ |
  | filter\$ | `any` | /\*\* Observable of the filter pattern applied by the entity collection's filter function _/ |
  | filteredEntities\$ | `any` | /** Observable of entities in the cached collection that pass the filter function \*/ |
  | keys\$ | `any` | /** Observable of the keys of the cached collection, in the collection's native sort order _/ |
  | loaded\$ | `any` | /\*\* Observable true when the collection has been loaded _/ |
  | loading\$ | `any` | /** Observable true when a multi-entity query command is in progress. \*/ |
  | changeState\$ | `any` | /** Original entity values for entities with unsaved changes \*/ |
