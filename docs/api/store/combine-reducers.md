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

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store/src/utils.ts#L14-L45)

## Parameters

| Name         | Type  | Description |
| ------------ | ----- | ----------- |
| reducers     | `any` |             |
| initialState | `any` |             |

## Overloads

```ts
function combineReducers<T, V extends Action = Action>(
  reducers: ActionReducerMap<T, V>,
  initialState?: Partial<T>
): ActionReducer<T, V>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store/src/utils.ts#L10-L13)

### Parameters

| Name         | Type                     | Description |
| ------------ | ------------------------ | ----------- |
| reducers     | `ActionReducerMap<T, V>` |             |
| initialState | `Partial<T>`             |             |
