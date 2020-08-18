---
kind: ClassDeclaration
name: EntityCollectionServiceElementsFactory
module: data
---

# EntityCollectionServiceElementsFactory

```ts
class EntityCollectionServiceElementsFactory {
  create<T, S$ extends EntitySelectors$<T> = EntitySelectors$<T>>(
    entityName: string
  ): EntityCollectionServiceElements<T, S$>;
}
```
