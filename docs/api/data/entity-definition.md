---
kind: InterfaceDeclaration
name: EntityDefinition
module: data
---

# EntityDefinition

```ts
interface EntityDefinition<T = any> {
  entityName: string;
  entityAdapter: EntityAdapter<T>;
  entityDispatcherOptions?: Partial<EntityDispatcherDefaultOptions>;
  initialState: EntityCollection<T>;
  metadata: EntityMetadata<T>;
  noChangeTracking: boolean;
  selectId: IdSelector<T>;
  sortComparer: false | Comparer<T>;
}
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/entity-metadata/entity-definition.ts#L9-L18)
