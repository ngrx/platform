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

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/reducers/entity-collection.ts#L19-L22)
