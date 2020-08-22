---
kind: ClassDeclaration
name: SaveEntitiesSuccess
module: data
---

# SaveEntitiesSuccess

```ts
class SaveEntitiesSuccess implements Action {
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
  readonly type = EntityCacheAction.SAVE_ENTITIES_SUCCESS;
}
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/actions/entity-cache-action.ts#L189-L213)

## Parameters

| Name    | Type                                                                                                                                                                                                                    | Description |
| ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| payload | `{ readonly changeSet: ChangeSet; readonly url: string; readonly correlationId?: any; readonly isOptimistic?: boolean; readonly mergeStrategy?: MergeStrategy; readonly tag?: string; error?: Error; skip?: boolean; }` |             |
| type    | `EntityCacheAction.SAVE_ENTITIES_SUCCESS`                                                                                                                                                                               |             |
