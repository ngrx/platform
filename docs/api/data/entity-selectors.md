---
kind: InterfaceDeclaration
name: EntitySelectors
module: data
---

# EntitySelectors

## description

The selector functions for entity collection members,
Selects from store root, through EntityCache, to the entity collection member
Contrast with {CollectionSelectors}.

```ts
interface EntitySelectors<T> {
  readonly entityName: string;
  readonly selectCollection: MemoizedSelector<Object, EntityCollection<T>>;
  readonly selectCount: MemoizedSelector<Object, number>;
  readonly selectEntities: MemoizedSelector<Object, T[]>;
  readonly selectEntityCache: MemoizedSelector<Object, EntityCache>;
  readonly selectEntityMap: MemoizedSelector<Object, Dictionary<T>>;
  readonly selectFilter: MemoizedSelector<Object, string>;
  readonly selectFilteredEntities: MemoizedSelector<Object, T[]>;
  readonly selectKeys: MemoizedSelector<Object, string[] | number[]>;
  readonly selectLoaded: MemoizedSelector<Object, boolean>;
  readonly selectLoading: MemoizedSelector<Object, boolean>;
  readonly selectChangeState: MemoizedSelector<Object, ChangeStateMap<T>>;
}
```
