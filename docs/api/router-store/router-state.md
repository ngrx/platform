---
kind: EnumDeclaration
name: RouterState
module: router-store
---

# RouterState

## description

Full = Serializes the router event with DefaultRouterStateSerializer
Minimal = Serializes the router event with MinimalRouterStateSerializer

```ts
export const enum RouterState {
  Full,
  Minimal,
}
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/router-store/src/router_store_module.ts#L47-L50)
