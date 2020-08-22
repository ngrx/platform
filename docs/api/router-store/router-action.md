---
kind: TypeAliasDeclaration
name: RouterAction
module: router-store
---

# RouterAction

## description

A union type of router actions.

```ts
export type RouterAction<
  T,
  V extends BaseRouterStoreState = SerializedRouterStateSnapshot
> =
  | RouterRequestAction<V>
  | RouterNavigationAction<V>
  | RouterCancelAction<T, V>
  | RouterErrorAction<T, V>
  | RouterNavigatedAction<V>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/router-store/src/actions.ts#L171-L179)
