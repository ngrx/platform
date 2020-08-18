---
kind: TypeAliasDeclaration
name: RouterRequestPayload
module: router-store
---

# RouterRequestPayload

## description

Payload of ROUTER_REQUEST

```ts
export type RouterRequestPayload<
  T extends BaseRouterStoreState = SerializedRouterStateSnapshot
> = {
  routerState: T;
  event: NavigationStart;
};
```
