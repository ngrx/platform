---
kind: InterfaceDeclaration
name: EntityCollectionReducerMethodMap
module: data
---

# EntityCollectionReducerMethodMap

## description

Map of {EntityOp} to reducer method for the operation.
If an operation is missing, caller should return the collection for that reducer.

```ts
interface EntityCollectionReducerMethodMap<T> {}
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/reducers/entity-collection-reducer-methods.ts#L24-L29)
