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

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/reducers/entity-collection-reducer.ts#L7-L10)
