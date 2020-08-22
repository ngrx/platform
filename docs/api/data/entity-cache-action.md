---
kind: EnumDeclaration
name: EntityCacheAction
module: data
---

# EntityCacheAction

```ts
export enum EntityCacheAction {
  CLEAR_COLLECTIONS = '@ngrx/data/entity-cache/clear-collections',
  LOAD_COLLECTIONS = '@ngrx/data/entity-cache/load-collections',
  MERGE_QUERY_SET = '@ngrx/data/entity-cache/merge-query-set',
  SET_ENTITY_CACHE = '@ngrx/data/entity-cache/set-cache',

  SAVE_ENTITIES = '@ngrx/data/entity-cache/save-entities',
  SAVE_ENTITIES_CANCEL = '@ngrx/data/entity-cache/save-entities-cancel',
  SAVE_ENTITIES_CANCELED = '@ngrx/data/entity-cache/save-entities-canceled',
  SAVE_ENTITIES_ERROR = '@ngrx/data/entity-cache/save-entities-error',
  SAVE_ENTITIES_SUCCESS = '@ngrx/data/entity-cache/save-entities-success',
}
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/actions/entity-cache-action.ts#L14-L25)
