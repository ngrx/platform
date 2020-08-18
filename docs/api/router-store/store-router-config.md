---
kind: InterfaceDeclaration
name: StoreRouterConfig
module: router-store
---

# StoreRouterConfig

```ts
interface StoreRouterConfig<
  T extends BaseRouterStoreState = SerializedRouterStateSnapshot
> {
  stateKey?: StateKeyOrSelector<T>;
  serializer?: new (...args: any[]) => RouterStateSerializer;
  navigationActionTiming?: NavigationActionTiming;
  routerState?: RouterState;
}
```
