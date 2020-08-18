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
