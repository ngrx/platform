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

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/actions/entity-cache-action.ts#L144-L161)

## Parameters

| Name    | Type                                                                                                                 | Description |
| ------- | -------------------------------------------------------------------------------------------------------------------- | ----------- |
| payload | `{ readonly correlationId: any; readonly reason?: string; readonly entityNames?: string[]; readonly tag?: string; }` |             |
| type    | `EntityCacheAction.SAVE_ENTITIES_CANCEL`                                                                             |             |
