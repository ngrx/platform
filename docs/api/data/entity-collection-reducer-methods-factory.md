---
kind: ClassDeclaration
name: EntityCollectionReducerMethodsFactory
module: data
---

# EntityCollectionReducerMethodsFactory

## description

Creates {EntityCollectionReducerMethods} for a given entity type.

```ts
class EntityCollectionReducerMethodsFactory {
  create<T>(entityName: string): EntityCollectionReducerMethodMap<T>;
}
```
