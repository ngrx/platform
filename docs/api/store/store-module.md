---
kind: ClassDeclaration
name: StoreModule
module: store
---

# StoreModule

```ts
class StoreModule {
  static forRoot(
    reducers:
      | ActionReducerMap<any, any>
      | InjectionToken<ActionReducerMap<any, any>>,
    config: RootStoreConfig<any, any> = {}
  ): ModuleWithProviders<StoreRootModule>;
  static forFeature(
    featureName: string,
    reducers:
      | ActionReducerMap<any, any>
      | InjectionToken<ActionReducerMap<any, any>>
      | ActionReducer<any, any>
      | InjectionToken<ActionReducer<any, any>>,
    config: StoreConfig<any, any> | InjectionToken<StoreConfig<any, any>> = {}
  ): ModuleWithProviders<StoreFeatureModule>;
}
```
