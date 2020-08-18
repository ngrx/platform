---
kind: TypeAliasDeclaration
name: RouterNavigationPayload
module: router-store
---

# RouterNavigationPayload

## description

Payload of ROUTER_NAVIGATION.

```ts
export type RouterNavigationPayload<
  T extends BaseRouterStoreState = SerializedRouterStateSnapshot
> = {
  routerState: T;
  event: RoutesRecognized;
};
```
