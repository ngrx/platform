---
kind: ClassDeclaration
name: EntityCollectionServiceFactory
module: data
---

# EntityCollectionServiceFactory

## description

Creates EntityCollectionService instances for
a cached collection of T entities in the ngrx store.

```ts
class EntityCollectionServiceFactory {
  create<T, S$ extends EntitySelectors$<T> = EntitySelectors$<T>>(
    entityName: string
  ): EntityCollectionService<T>;
}
```
