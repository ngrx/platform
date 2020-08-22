---
kind: FunctionDeclaration
name: routerReducer
module: router-store
---

# routerReducer

```ts
function routerReducer<
  T extends BaseRouterStoreState = SerializedRouterStateSnapshot
>(
  state: RouterReducerState<T> | undefined,
  action: Action
): RouterReducerState<T>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/router-store/src/reducer.ts#L18-L37)

## Parameters

| Name   | Type                    | Description |
| ------ | ----------------------- | ----------- |
| state  | `RouterReducerState<T>` |             |
| action | `any`                   |             |
