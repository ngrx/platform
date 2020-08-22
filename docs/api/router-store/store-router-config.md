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

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/router-store/src/router_store_module.ts#L52-L71)
