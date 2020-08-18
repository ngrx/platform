---
kind: TypeAliasDeclaration
name: EntityCollectionReducer
module: data
---

# EntityCollectionReducer

```ts
export type EntityCollectionReducer<T = any> = (
  collection: EntityCollection<T>,
  action: EntityAction
) => EntityCollection<T>;
```
