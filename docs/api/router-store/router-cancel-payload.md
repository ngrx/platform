---
kind: TypeAliasDeclaration
name: RouterCancelPayload
module: router-store
---

# RouterCancelPayload

## description

Payload of ROUTER_CANCEL.

```ts
export type RouterCancelPayload<
  T,
  V extends BaseRouterStoreState = SerializedRouterStateSnapshot
> = {
  routerState: V;
  storeState: T;
  event: NavigationCancel;
};
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/router-store/src/actions.ts#L80-L87)
