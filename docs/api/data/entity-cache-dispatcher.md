---
kind: ClassDeclaration
name: EntityCacheDispatcher
module: data
---

# EntityCacheDispatcher

## description

Dispatches Entity Cache actions to the EntityCache reducer

```ts
class EntityCacheDispatcher {
  reducedActions$: Observable<Action>;

  dispatch(action: Action): Action;
  cancelSaveEntities(
    correlationId: any,
    reason?: string,
    entityNames?: string[],
    tag?: string
  ): void;
  clearCollections(collections?: string[], tag?: string);
  loadCollections(collections: EntityCacheQuerySet, tag?: string);
  mergeQuerySet(
    querySet: EntityCacheQuerySet,
    mergeStrategy?: MergeStrategy,
    tag?: string
  );
  setEntityCache(cache: EntityCache, tag?: string);
  saveEntities(
    changes: ChangeSetItem[] | ChangeSet,
    url: string,
    options?: EntityActionOptions
  ): Observable<ChangeSet>;
}
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/dispatchers/entity-cache-dispatcher.ts#L32-L219)

## Methods

### dispatch

#### description (#dispatch-description)

Dispatch an Action to the store.

```ts
dispatch(action: Action): Action;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/dispatchers/entity-cache-dispatcher.ts#L67-L70)

#### Parameters (#dispatch-parameters)

| Name   | Type  | Description |
| ------ | ----- | ----------- |
| action | `any` | the Action  |

#### returns (#dispatch-returns)

the dispatched Action

### cancelSaveEntities

#### description (#cancelSaveEntities-description)

Dispatch action to cancel the saveEntities request with matching correlation id.

```ts
cancelSaveEntities(  correlationId: any,  reason?: string,  entityNames?: string[],  tag?: string ): void;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/dispatchers/entity-cache-dispatcher.ts#L79-L95)

#### Parameters (#cancelSaveEntities-parameters)

| Name          | Type                                                                           | Description                                     |
| ------------- | ------------------------------------------------------------------------------ | ----------------------------------------------- |
| correlationId | `any`                                                                          | The correlation id for the corresponding action |
| [reason]      | `` | explains why canceled and by whom.                                        |
| [entityNames] | `` | array of entity names so can turn off loading flag for their collections. |
| [tag]         | `` | tag to identify the operation from the app perspective.                   |
| reason        | `string`                                                                       |                                                 |
| entityNames   | `string[]`                                                                     |                                                 |
| tag           | `string`                                                                       |                                                 |

### clearCollections

```ts
clearCollections(collections?: string[], tag?: string);
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/dispatchers/entity-cache-dispatcher.ts#L102-L104)

#### Parameters (#clearCollections-parameters)

| Name          | Type                                                         | Description |
| ------------- | ------------------------------------------------------------ | ----------- |
| [collections] | `` | Array of names of the collections to clear.             |
| [tag]         | `` | tag to identify the operation from the app perspective. |
| collections   | `string[]`                                                   |             |
| tag           | `string`                                                     |             |

### loadCollections

#### description (#loadCollections-description)

Load multiple entity collections at the same time.
before any selectors\$ observables emit.

```ts
loadCollections(collections: EntityCacheQuerySet, tag?: string);
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/dispatchers/entity-cache-dispatcher.ts#L113-L115)

#### Parameters (#loadCollections-parameters)

| Name        | Type                                                         | Description                                               |
| ----------- | ------------------------------------------------------------ | --------------------------------------------------------- |
| collections | `EntityCacheQuerySet`                                        | The collections to load, typically the result of a query. |
| [tag]       | `` | tag to identify the operation from the app perspective. |
| tag         | `string`                                                     |                                                           |

### mergeQuerySet

#### description (#mergeQuerySet-description)

Merges entities from a query result
that returned entities from multiple collections.
Corresponding entity cache reducer should add and update all collections
at the same time, before any selectors\$ observables emit.

```ts
mergeQuerySet(  querySet: EntityCacheQuerySet,  mergeStrategy?: MergeStrategy,  tag?: string );
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/dispatchers/entity-cache-dispatcher.ts#L128-L134)

#### Parameters (#mergeQuerySet-parameters)

| Name          | Type                                                         | Description                                                         |
| ------------- | ------------------------------------------------------------ | ------------------------------------------------------------------- |
| querySet      | `EntityCacheQuerySet`                                        | The result of the query in the form of a map of entity collections. |
| mergeStrategy | `MergeStrategy`                                              | How to merge a queried entity when it is already in the collection. |
| [tag]         | `` | tag to identify the operation from the app perspective. |
| tag           | `string`                                                     |                                                                     |

### setEntityCache

#### description (#setEntityCache-description)

Create entity cache action for replacing the entire entity cache.
Dangerous because brute force but useful as when re-hydrating an EntityCache
from local browser storage when the application launches.

```ts
setEntityCache(cache: EntityCache, tag?: string);
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/dispatchers/entity-cache-dispatcher.ts#L143-L145)

#### Parameters (#setEntityCache-parameters)

| Name  | Type                                                         | Description                   |
| ----- | ------------------------------------------------------------ | ----------------------------- |
| cache | `EntityCache`                                                | New state of the entity cache |
| [tag] | `` | tag to identify the operation from the app perspective. |
| tag   | `string`                                                     |                               |

### saveEntities

#### description (#saveEntities-description)

Dispatch action to save multiple entity changes to remote storage.
Relies on an Ngrx Effect such as EntityEffects.saveEntities\$.
Important: only call if your server supports the SaveEntities protocol
through your EntityDataService.saveEntities method.

```ts
saveEntities(  changes: ChangeSetItem[] | ChangeSet,  url: string,  options?: EntityActionOptions ): Observable<ChangeSet>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/dispatchers/entity-cache-dispatcher.ts#L161-L183)

#### Parameters (#saveEntities-parameters)

| Name      | Type                                                                      | Description                                                     |
| --------- | ------------------------------------------------------------------------- | --------------------------------------------------------------- |
| changes   | `ChangeSetItem[] | ChangeSet<any>`                                        | Either the entities to save, as an array of {ChangeSetItem}, or |
| url       | `string`                                                                  | The server url which receives the save request                  |
| [options] | `` | options such as tag, correlationId, isOptimistic, and mergeStrategy. |
| options   | `EntityActionOptions`                                                     |                                                                 |

#### returns (#saveEntities-returns)

A terminating Observable<ChangeSet> with data returned from the server
after server reports successful save OR the save error.
TODO: should return the matching entities from cache rather than the raw server data.

## Parameters

| Name             | Type              | Description |
| ---------------- | ----------------- | ----------- |
| reducedActions\$ | `Observable<any>` | /\*\*       |

- Actions scanned by the store after it processed them with reducers.
- A replay observable of the most recent action reduced by the store.
  \*/ |
