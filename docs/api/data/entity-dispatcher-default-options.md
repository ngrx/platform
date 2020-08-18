---
kind: ClassDeclaration
name: EntityDispatcherDefaultOptions
module: data
---

# EntityDispatcherDefaultOptions

## description

Default options for EntityDispatcher behavior
such as whether `add()` is optimistic or pessimistic by default.
An optimistic save modifies the collection immediately and before saving to the server.
A pessimistic save modifies the collection after the server confirms the save was successful.
This class initializes the defaults to the safest values.
Provide an alternative to change the defaults for all entity collections.

```ts
class EntityDispatcherDefaultOptions {
  optimisticAdd = false;
  optimisticDelete = true;
  optimisticUpdate = false;
  optimisticUpsert = false;
  optimisticSaveEntities = false;
}
```
