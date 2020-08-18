---
kind: ClassDeclaration
name: MergeQuerySet
module: data
---

# MergeQuerySet

## description

Create entity cache action that merges entities from a query result
that returned entities from multiple collections.
Corresponding entity cache reducer should add and update all collections
at the same time, before any selectors\$ observables emit.

```ts
class MergeQuerySet implements Action {
  readonly payload: {
    querySet: EntityCacheQuerySet;
    mergeStrategy?: MergeStrategy;
    tag?: string;
  };
  readonly type = EntityCacheAction.MERGE_QUERY_SET;
}
```

## Parameters

| Name          | Type                                                                     | Description |
| ------------- | ------------------------------------------------------------------------ | ----------- |
| querySet      | `` | The result of the query in the form of a map of entity collections. |
| mergeStrategy | `` | How to merge a queried entity when it is already in the collection. |
| [tag]         | `` | Optional tag to identify the operation from the app perspective.    |
