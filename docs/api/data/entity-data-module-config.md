---
kind: InterfaceDeclaration
name: EntityDataModuleConfig
module: data
---

# EntityDataModuleConfig

```ts
interface EntityDataModuleConfig {
  entityMetadata?: EntityMetadataMap;
  entityCacheMetaReducers?: (
    | MetaReducer<EntityCache, Action>
    | InjectionToken<MetaReducer<EntityCache, Action>>
  )[];
  entityCollectionMetaReducers?: MetaReducer<EntityCollection, EntityAction>[];
  initialEntityCacheState?: EntityCache | (() => EntityCache);
  pluralNames?: { [name: string]: string };
}
```
