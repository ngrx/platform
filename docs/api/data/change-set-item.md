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
