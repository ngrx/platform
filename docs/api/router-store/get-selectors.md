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

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/router-store/src/router_selectors.ts#L8-L63)

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

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/router-store/src/router_selectors.ts#L5-L7)

### Parameters

| Name        | Type                                    | Description |
| ----------- | --------------------------------------- | ----------- |
| selectState | `(state: V) => RouterReducerState<any>` |             |
