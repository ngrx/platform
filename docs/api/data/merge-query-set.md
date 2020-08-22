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

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/actions/entity-cache-action.ts#L78-L99)

## Parameters

| Name          | Type                                                                     | Description |
| ------------- | ------------------------------------------------------------------------ | ----------- |
| querySet      | `` | The result of the query in the form of a map of entity collections. |
| mergeStrategy | `` | How to merge a queried entity when it is already in the collection. |
| [tag]         | `` | Optional tag to identify the operation from the app perspective.    |

## Parameters

| Name    | Type                                                                              | Description |
| ------- | --------------------------------------------------------------------------------- | ----------- |
| payload | `{ querySet: EntityCacheQuerySet; mergeStrategy?: MergeStrategy; tag?: string; }` |             |
| type    | `EntityCacheAction.MERGE_QUERY_SET`                                               |             |
