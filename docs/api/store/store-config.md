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
