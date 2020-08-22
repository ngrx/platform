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

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/actions/entity-cache-action.ts#L118-L142)

## Parameters

| Name    | Type                                                                                                                                                                                                                    | Description |
| ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| payload | `{ readonly changeSet: ChangeSet; readonly url: string; readonly correlationId?: any; readonly isOptimistic?: boolean; readonly mergeStrategy?: MergeStrategy; readonly tag?: string; error?: Error; skip?: boolean; }` |             |
| type    | `EntityCacheAction.SAVE_ENTITIES`                                                                                                                                                                                       |             |
