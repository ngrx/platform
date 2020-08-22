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

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/router-store/src/actions.ts#L113-L120)
