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
