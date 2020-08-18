---
kind: ClassDeclaration
name: EntitySelectorsFactory
module: data
---

# EntitySelectorsFactory

```ts
class EntitySelectorsFactory {
  createCollectionSelector<
    T = any,
    C extends EntityCollection<T> = EntityCollection<T>
  >(entityName: string);
  createCollectionSelectors<
    T,
    S extends CollectionSelectors<T> = CollectionSelectors<T>
  >(metadataOrName: EntityMetadata<T> | string): S;
  create<T, S extends EntitySelectors<T> = EntitySelectors<T>>(
    metadataOrName: EntityMetadata<T> | string
  ): S;
}
```
