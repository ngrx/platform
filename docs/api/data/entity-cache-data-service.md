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
