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

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/router-store/src/serializers/base.ts#L8-L10)
