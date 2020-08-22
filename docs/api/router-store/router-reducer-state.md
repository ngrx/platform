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

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/router-store/src/reducer.ts#L11-L16)
