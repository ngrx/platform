---
kind: InterfaceDeclaration
name: EntityCollection
module: data
---

# EntityCollection

## description

Data and information about a collection of entities of a single type.
EntityCollections are maintained in the EntityCache within the ngrx store.

```ts
interface EntityCollection<T = any> {
  entityName: string;
  changeState: ChangeStateMap<T>;
  filter?: string;
  loaded: boolean;
  loading: boolean;
}
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/reducers/entity-collection.ts#L34-L45)
