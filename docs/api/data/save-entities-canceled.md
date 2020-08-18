---
kind: ClassDeclaration
name: SaveEntitiesCanceled
module: data
---

# SaveEntitiesCanceled

```ts
class SaveEntitiesCanceled implements Action {
  readonly payload: {
    readonly correlationId: any;
    readonly reason?: string;
    readonly tag?: string;
  };
  readonly type = EntityCacheAction.SAVE_ENTITIES_CANCEL;
}
```
