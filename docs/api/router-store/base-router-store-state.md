---
kind: InterfaceDeclaration
name: BaseRouterStoreState
module: router-store
---

# BaseRouterStoreState

## description

Simple router state.
All custom router states / state serializers should have at least
the properties of this interface.

```ts
interface BaseRouterStoreState {
  url: string;
}
```
