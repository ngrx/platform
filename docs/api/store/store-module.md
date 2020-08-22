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
  static forRoot<T, V extends Action = Action>(
    reducers: ActionReducerMap<T, V> | InjectionToken<ActionReducerMap<T, V>>,
    config?: RootStoreConfig<T, V>
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
  static forFeature<T, V extends Action = Action>(
    featureName: string,
    reducers: ActionReducerMap<T, V> | InjectionToken<ActionReducerMap<T, V>>,
    config?: StoreConfig<T, V> | InjectionToken<StoreConfig<T, V>>
  ): ModuleWithProviders<StoreFeatureModule>;
  static forFeature<T, V extends Action = Action>(
    featureName: string,
    reducer: ActionReducer<T, V> | InjectionToken<ActionReducer<T, V>>,
    config?: StoreConfig<T, V> | InjectionToken<StoreConfig<T, V>>
  ): ModuleWithProviders<StoreFeatureModule>;
}
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store/src/store_module.ts#L117-L257)

## Methods

### forRoot

```ts
static forRoot(  reducers:   | ActionReducerMap<any, any>   | InjectionToken<ActionReducerMap<any, any>>,  config: RootStoreConfig<any, any> = {} ): ModuleWithProviders<StoreRootModule>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store/src/store_module.ts#L123-L183)

#### Parameters (#forRoot-parameters)

| Name     | Type                                                                      | Description |
| -------- | ------------------------------------------------------------------------- | ----------- |
| reducers | `ActionReducerMap<any, any> | InjectionToken<ActionReducerMap<any, any>>` |             |
| config   | `RootStoreConfig<any, any>`                                               |             |

### forRoot

```ts
static forRoot<T, V extends Action = Action>(  reducers: ActionReducerMap<T, V> | InjectionToken<ActionReducerMap<T, V>>,  config?: RootStoreConfig<T, V> ): ModuleWithProviders<StoreRootModule>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store/src/store_module.ts#L119-L122)

#### Parameters (#forRoot-parameters)

| Name     | Type                                                              | Description |
| -------- | ----------------------------------------------------------------- | ----------- |
| reducers | `ActionReducerMap<T, V> | InjectionToken<ActionReducerMap<T, V>>` |             |
| config   | `RootStoreConfig<T, V>`                                           |             |

### forFeature

```ts
static forFeature(  featureName: string,  reducers:   | ActionReducerMap<any, any>   | InjectionToken<ActionReducerMap<any, any>>   | ActionReducer<any, any>   | InjectionToken<ActionReducer<any, any>>,  config: StoreConfig<any, any> | InjectionToken<StoreConfig<any, any>> = {} ): ModuleWithProviders<StoreFeatureModule>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store/src/store_module.ts#L195-L256)

#### Parameters (#forFeature-parameters)

| Name        | Type                                                                                                                                          | Description |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| featureName | `string`                                                                                                                                      |             |
| reducers    | `ActionReducerMap<any, any> | InjectionToken<ActionReducerMap<any, any>> | ActionReducer<any, any> | InjectionToken<ActionReducer<any, any>>` |             |
| config      | `StoreConfig<any, any> | InjectionToken<StoreConfig<any, any>>`                                                                               |             |

### forFeature

```ts
static forFeature<T, V extends Action = Action>(  featureName: string,  reducers: ActionReducerMap<T, V> | InjectionToken<ActionReducerMap<T, V>>,  config?: StoreConfig<T, V> | InjectionToken<StoreConfig<T, V>> ): ModuleWithProviders<StoreFeatureModule>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store/src/store_module.ts#L185-L189)

#### Parameters (#forFeature-parameters)

| Name        | Type                                                              | Description |
| ----------- | ----------------------------------------------------------------- | ----------- |
| featureName | `string`                                                          |             |
| reducers    | `ActionReducerMap<T, V> | InjectionToken<ActionReducerMap<T, V>>` |             |
| config      | `StoreConfig<T, V> | InjectionToken<StoreConfig<T, V>>`           |             |

### forFeature

```ts
static forFeature<T, V extends Action = Action>(  featureName: string,  reducer: ActionReducer<T, V> | InjectionToken<ActionReducer<T, V>>,  config?: StoreConfig<T, V> | InjectionToken<StoreConfig<T, V>> ): ModuleWithProviders<StoreFeatureModule>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store/src/store_module.ts#L190-L194)

#### Parameters (#forFeature-parameters)

| Name        | Type                                                        | Description |
| ----------- | ----------------------------------------------------------- | ----------- |
| featureName | `string`                                                    |             |
| reducer     | `ActionReducer<T, V> | InjectionToken<ActionReducer<T, V>>` |             |
| config      | `StoreConfig<T, V> | InjectionToken<StoreConfig<T, V>>`     |             |
