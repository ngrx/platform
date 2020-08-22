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

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/actions/entity-cache-action.ts#L176-L187)

## Parameters

| Name    | Type                                                                                                        | Description |
| ------- | ----------------------------------------------------------------------------------------------------------- | ----------- |
| payload | `{ readonly error: DataServiceError; readonly originalAction: SaveEntities; readonly correlationId: any; }` |             |
| type    | `EntityCacheAction.SAVE_ENTITIES_ERROR`                                                                     |             |
