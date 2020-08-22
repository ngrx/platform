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

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/actions/entity-cache-action.ts#L163-L174)

## Parameters

| Name    | Type                                                                                | Description |
| ------- | ----------------------------------------------------------------------------------- | ----------- |
| payload | `{ readonly correlationId: any; readonly reason?: string; readonly tag?: string; }` |             |
| type    | `EntityCacheAction.SAVE_ENTITIES_CANCEL`                                            |             |
