---
kind: ClassDeclaration
name: ClearCollections
module: data
---

# ClearCollections

## description

Clear the collections identified in the collectionSet.

```ts
class ClearCollections implements Action {
  readonly payload: { collections?: string[]; tag?: string };
  readonly type = EntityCacheAction.CLEAR_COLLECTIONS;
}
```

## Parameters

| Name          | Type                                                                  | Description |
| ------------- | --------------------------------------------------------------------- | ----------- |
| [collections] | `` | Array of names of the collections to clear.                      |
| [tag]         | `` | Optional tag to identify the operation from the app perspective. |
