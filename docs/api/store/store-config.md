---
kind: InterfaceDeclaration
name: StoreConfig
module: store
---

# StoreConfig

```ts
interface StoreConfig<T, V extends Action = Action> {
  initialState?: InitialState<T>;
  reducerFactory?: ActionReducerFactory<T, V>;
  metaReducers?: MetaReducer<T, V>[];
}
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store/src/store_module.ts#L106-L110)
