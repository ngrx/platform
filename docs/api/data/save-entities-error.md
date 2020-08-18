---
kind: ClassDeclaration
name: SaveEntitiesError
module: data
---

# SaveEntitiesError

```ts
class SaveEntitiesError {
  readonly payload: {
    readonly error: DataServiceError;
    readonly originalAction: SaveEntities;
    readonly correlationId: any;
  };
  readonly type = EntityCacheAction.SAVE_ENTITIES_ERROR;
}
```
