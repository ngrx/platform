---
kind: ClassDeclaration
name: SaveEntities
module: data
---

# SaveEntities

```ts
class SaveEntities implements Action {
  readonly payload: {
    readonly changeSet: ChangeSet;
    readonly url: string;
    readonly correlationId?: any;
    readonly isOptimistic?: boolean;
    readonly mergeStrategy?: MergeStrategy;
    readonly tag?: string;
    error?: Error;
    skip?: boolean;
  };
  readonly type = EntityCacheAction.SAVE_ENTITIES;
}
```
