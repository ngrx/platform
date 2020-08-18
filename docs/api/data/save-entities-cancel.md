---
kind: ClassDeclaration
name: SaveEntitiesCancel
module: data
---

# SaveEntitiesCancel

```ts
class SaveEntitiesCancel implements Action {
  readonly payload: {
    readonly correlationId: any;
    readonly reason?: string;
    readonly entityNames?: string[];
    readonly tag?: string;
  };
  readonly type = EntityCacheAction.SAVE_ENTITIES_CANCEL;
}
```
