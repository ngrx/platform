---
kind: TypeAliasDeclaration
name: RouterErrorPayload
module: router-store
---

# RouterErrorPayload

## description

Payload of ROUTER_ERROR.

```ts
export type RouterErrorPayload<
  T,
  V extends BaseRouterStoreState = SerializedRouterStateSnapshot
> = {
  routerState: V;
  storeState: T;
  event: NavigationError;
};
```
