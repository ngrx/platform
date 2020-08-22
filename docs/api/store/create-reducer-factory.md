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

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store/src/utils.ts#L91-L109)

## Parameters

| Name           | Type                         | Description |
| -------------- | ---------------------------- | ----------- |
| reducerFactory | `ActionReducerFactory<T, V>` |             |
| metaReducers   | `MetaReducer<T, V>[]`        |             |
