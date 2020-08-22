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

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/router-store/src/actions.ts#L50-L55)
