---
kind: EnumDeclaration
name: ChangeType
module: data
---

# ChangeType

```ts
export enum ChangeType {
  /** The entity has not changed from its last known server state. */
  Unchanged = 0,
  /** The entity was added to the collection */
  Added,
  /** The entity is scheduled for delete and was removed from the collection */
  Deleted,
  /** The entity in the collection was updated */
  Updated,
}
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/reducers/entity-collection.ts#L4-L13)
