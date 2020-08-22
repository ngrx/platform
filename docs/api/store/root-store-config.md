---
kind: InterfaceDeclaration
name: RootStoreConfig
module: store
---

# RootStoreConfig

```ts
interface RootStoreConfig<T, V extends Action = Action> {
  runtimeChecks?: Partial<RuntimeChecks>;

  // inherited from StoreConfig
  initialState?: InitialState<T>;
  reducerFactory?: ActionReducerFactory<T, V>;
  metaReducers?: MetaReducer<T, V>[];
}
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store/src/store_module.ts#L112-L115)
