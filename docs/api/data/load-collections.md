---
kind: ClassDeclaration
name: LoadCollections
module: data
---

# LoadCollections

## description

Create entity cache action that loads multiple entity collections at the same time.
before any selectors\$ observables emit.

```ts
class LoadCollections implements Action {
  readonly payload: { collections: EntityCacheQuerySet; tag?: string };
  readonly type = EntityCacheAction.LOAD_COLLECTIONS;
}
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/actions/entity-cache-action.ts#L58-L65)

## Parameters

| Name     | Type                                                                  | Description |
| -------- | --------------------------------------------------------------------- | ----------- |
| querySet | `` | The collections to load, typically the result of a query.        |
| [tag]    | `` | Optional tag to identify the operation from the app perspective. |

## Parameters

| Name    | Type                                                  | Description |
| ------- | ----------------------------------------------------- | ----------- |
| payload | `{ collections: EntityCacheQuerySet; tag?: string; }` |             |
| type    | `EntityCacheAction.LOAD_COLLECTIONS`                  |             |
