---
kind: InterfaceDeclaration
name: MinimalRouterStateSnapshot
module: router-store
---

# MinimalRouterStateSnapshot

```ts
interface MinimalRouterStateSnapshot {
  root: MinimalActivatedRouteSnapshot;
  url: string;

  // inherited from BaseRouterStoreState
  url: string;
}
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/router-store/src/serializers/minimal_serializer.ts#L16-L19)
