---
kind: InterfaceDeclaration
name: EntityChangeTracker
module: data
---

# EntityChangeTracker

## description

Methods for tracking, committing, and reverting/undoing unsaved entity changes.
Used by EntityCollectionReducerMethods which should call tracker methods BEFORE modifying the collection.
See EntityChangeTracker docs.

```ts
interface EntityChangeTracker<T> {}
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/reducers/entity-change-tracker.ts#L11-L262)
