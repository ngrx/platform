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

## Parameters

| Name   | Type                    | Description |
| ------ | ----------------------- | ----------- |
| state  | `RouterReducerState<T>` |             |
| action | `any`                   |             |
