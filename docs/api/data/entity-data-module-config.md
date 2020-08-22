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

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/entity-data-without-effects.module.ts#L53-L63)
