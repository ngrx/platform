---
kind: InterfaceDeclaration
name: EntityCacheQuerySet
module: data
---

# EntityCacheQuerySet

## description

Hash of entities keyed by EntityCollection name,
typically the result of a query that returned results from a multi-collection query
that will be merged into an EntityCache via the `MergeQuerySet` action.

```ts
interface EntityCacheQuerySet {}
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/actions/entity-cache-action.ts#L32-L34)
