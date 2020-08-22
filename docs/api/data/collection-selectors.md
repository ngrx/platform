---
kind: InterfaceDeclaration
name: CollectionSelectors
module: data
---

# CollectionSelectors

## description

The selector functions for entity collection members,
Selects from the entity collection to the collection member
Contrast with {EntitySelectors}.

```ts
interface CollectionSelectors<T> {
  readonly selectCount: Selector<EntityCollection<T>, number>;
  readonly selectEntities: Selector<EntityCollection<T>, T[]>;
  readonly selectEntityMap: Selector<EntityCollection<T>, Dictionary<T>>;
  readonly selectFilter: Selector<EntityCollection<T>, string>;
  readonly selectFilteredEntities: Selector<EntityCollection<T>, T[]>;
  readonly selectKeys: Selector<EntityCollection<T>, string[] | number[]>;
  readonly selectLoaded: Selector<EntityCollection<T>, boolean>;
  readonly selectLoading: Selector<EntityCollection<T>, boolean>;
  readonly selectChangeState: Selector<EntityCollection<T>, ChangeStateMap<T>>;
}
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/selectors/entity-selectors.ts#L27-L56)
