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
