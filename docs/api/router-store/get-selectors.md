---
kind: FunctionDeclaration
name: getSelectors
module: router-store
---

# getSelectors

```ts
function getSelectors<V>(
  selectState: (state: V) => RouterReducerState<any>
): RouterStateSelectors<V>;
```

## Parameters

| Name        | Type                                    | Description |
| ----------- | --------------------------------------- | ----------- |
| selectState | `(state: V) => RouterReducerState<any>` |             |

## Overloads

```ts
function getSelectors<V>(
  selectState: (state: V) => RouterReducerState<any>
): RouterStateSelectors<V>;
```

### Parameters

| Name        | Type                                    | Description |
| ----------- | --------------------------------------- | ----------- |
| selectState | `(state: V) => RouterReducerState<any>` |             |
