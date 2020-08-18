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
