---
kind: InterfaceDeclaration
name: EntityMetadata
module: data
---

# EntityMetadata

```ts
interface EntityMetadata<T = any, S extends object = {}> {
  entityName: string;
  entityDispatcherOptions?: Partial<EntityDispatcherDefaultOptions>;
  filterFn?: EntityFilterFn<T>;
  noChangeTracking?: boolean;
  selectId?: IdSelector<T>;
  sortComparer?: false | Comparer<T>;
  additionalCollectionState?: S;
}
```
