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
