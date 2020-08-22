---
kind: InterfaceDeclaration
name: SerializedRouterStateSnapshot
module: router-store
---

# SerializedRouterStateSnapshot

```ts
interface SerializedRouterStateSnapshot {
  root: ActivatedRouteSnapshot;
  url: string;

  // inherited from BaseRouterStoreState
  url: string;
}
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/router-store/src/serializers/default_serializer.ts#L4-L7)
