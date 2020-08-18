---
kind: TypeAliasDeclaration
name: RouterReducerState
module: router-store
---

# RouterReducerState

```ts
export type RouterReducerState<
  T extends BaseRouterStoreState = SerializedRouterStateSnapshot
> = {
  state: T;
  navigationId: number;
};
```
