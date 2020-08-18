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
