---
kind: InterfaceDeclaration
name: MinimalActivatedRouteSnapshot
module: router-store
---

# MinimalActivatedRouteSnapshot

```ts
interface MinimalActivatedRouteSnapshot {
  routeConfig: ActivatedRouteSnapshot['routeConfig'];
  url: ActivatedRouteSnapshot['url'];
  params: ActivatedRouteSnapshot['params'];
  queryParams: ActivatedRouteSnapshot['queryParams'];
  fragment: ActivatedRouteSnapshot['fragment'];
  data: ActivatedRouteSnapshot['data'];
  outlet: ActivatedRouteSnapshot['outlet'];
  firstChild?: MinimalActivatedRouteSnapshot;
  children: MinimalActivatedRouteSnapshot[];
}
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/router-store/src/serializers/minimal_serializer.ts#L4-L14)
