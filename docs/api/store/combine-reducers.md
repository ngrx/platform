---
kind: FunctionDeclaration
name: combineReducers
module: store
---

# combineReducers

```ts
function combineReducers(
  reducers: any,
  initialState: any = {}
): ActionReducer<any, Action>;
```

## Parameters

| Name         | Type  | Description |
| ------------ | ----- | ----------- |
| reducers     | `any` |             |
| initialState | `any` |             |

## Overloads

```ts
function combineReducers(
  reducers: any,
  initialState: any = {}
): ActionReducer<any, Action>;
```

### Parameters

| Name         | Type                     | Description |
| ------------ | ------------------------ | ----------- |
| reducers     | `ActionReducerMap<T, V>` |             |
| initialState | `Partial<T>`             |             |
