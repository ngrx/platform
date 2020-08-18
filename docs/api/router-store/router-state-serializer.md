---
kind: ClassDeclaration
name: RouterStateSerializer
module: router-store
---

# RouterStateSerializer

```ts
class RouterStateSerializer<
  T extends BaseRouterStoreState = BaseRouterStoreState
> {
  abstract serialize(routerState: RouterStateSnapshot): T;
}
```
