---
kind: FunctionDeclaration
name: createReducerFactory
module: store
---

# createReducerFactory

```ts
function createReducerFactory<T, V extends Action = Action>(
  reducerFactory: ActionReducerFactory<T, V>,
  metaReducers?: MetaReducer<T, V>[]
): ActionReducerFactory<T, V>;
```

## Parameters

| Name           | Type                         | Description |
| -------------- | ---------------------------- | ----------- |
| reducerFactory | `ActionReducerFactory<T, V>` |             |
| metaReducers   | `MetaReducer<T, V>[]`        |             |
