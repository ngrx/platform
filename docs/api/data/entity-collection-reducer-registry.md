---
kind: ClassDeclaration
name: EntityCollectionReducerRegistry
module: data
---

# EntityCollectionReducerRegistry

## description

Registry of entity types and their previously-constructed reducers.
Can create a new CollectionReducer, which it registers for subsequent use.

```ts
class EntityCollectionReducerRegistry {
  getOrCreateReducer<T>(entityName: string): EntityCollectionReducer<T>;
  registerReducer<T>(
    entityName: string,
    reducer: EntityCollectionReducer<T>
  ): EntityCollectionReducer<T>;
  registerReducers(reducers: EntityCollectionReducers);
}
```
