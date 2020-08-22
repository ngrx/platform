---
kind: TypeAliasDeclaration
name: ChangeSetItem
module: data
---

# ChangeSetItem

## description

A entities of a single entity type, which are changed in the same way by a ChangeSetOperation

```ts
export type ChangeSetItem =
  | ChangeSetAdd
  | ChangeSetDelete
  | ChangeSetUpdate
  | ChangeSetUpsert;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/actions/entity-cache-change-set.ts#L36-L40)
