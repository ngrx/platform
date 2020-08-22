---
kind: ClassDeclaration
name: EntityCacheDataService
module: data
---

# EntityCacheDataService

## description

Default data service for making remote service calls targeting the entire EntityCache.
See EntityDataService for services that target a single EntityCollection

```ts
class EntityCacheDataService {
  saveEntities(changeSet: ChangeSet, url: string): Observable<ChangeSet>;
}
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/dataservices/entity-cache-data.service.ts#L27-L166)

## Methods

### saveEntities

#### description (#saveEntities-description)

Save changes to multiple entities across one or more entity collections.
Server endpoint must understand the essential SaveEntities protocol,
in particular the ChangeSet interface (except for Update<T>).
This implementation extracts the entity changes from a ChangeSet Update<T>[] and sends those.
It then reconstructs Update<T>[] in the returned observable result.

```ts
saveEntities(changeSet: ChangeSet, url: string): Observable<ChangeSet>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/dataservices/entity-cache-data.service.ts#L54-L76)

#### Parameters (#saveEntities-parameters)

| Name      | Type             | Description                                     |
| --------- | ---------------- | ----------------------------------------------- |
| changeSet | `ChangeSet<any>` | An array of SaveEntityItems.                    |
| url       | `string`         | The server endpoint that receives this request. |
