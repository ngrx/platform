---
kind: ClassDeclaration
name: EntityCollectionCreator
module: data
---

# EntityCollectionCreator

```ts
class EntityCollectionCreator {
  create<T = any, S extends EntityCollection<T> = EntityCollection<T>>(
    entityName: string
  ): S;
}
```
