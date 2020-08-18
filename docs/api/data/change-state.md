---
kind: InterfaceDeclaration
name: ChangeState
module: data
---

# ChangeState

## description

Change state for an entity with unsaved changes;
an entry in an EntityCollection.changeState map

```ts
interface ChangeState<T> {
  changeType: ChangeType;
  originalValue?: T | undefined;
}
```
