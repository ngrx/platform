---
kind: TypeAliasDeclaration
name: ChangeStateMap
module: data
---

# ChangeStateMap

## description

Map of entity primary keys to entity ChangeStates.
Each entry represents an entity with unsaved changes.

```ts
export type ChangeStateMap<T> = Dictionary<ChangeState<T>>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/reducers/entity-collection.ts#L28-L28)
