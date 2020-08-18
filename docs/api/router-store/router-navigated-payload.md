---
kind: TypeAliasDeclaration
name: RouterNavigatedPayload
module: router-store
---

# RouterNavigatedPayload

## description

Payload of ROUTER_NAVIGATED.

```ts
export type RouterNavigatedPayload<
  T extends BaseRouterStoreState = SerializedRouterStateSnapshot
> = {
  routerState: T;
  event: NavigationEnd;
};
```
