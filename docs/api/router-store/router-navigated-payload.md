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

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/router-store/src/actions.ts#L146-L151)
