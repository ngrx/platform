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

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/router-store/src/actions.ts#L21-L26)
