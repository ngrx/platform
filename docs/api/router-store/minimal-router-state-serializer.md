---
kind: ClassDeclaration
name: MinimalRouterStateSerializer
module: router-store
---

# MinimalRouterStateSerializer

```ts
class MinimalRouterStateSerializer
  implements RouterStateSerializer<MinimalRouterStateSnapshot> {
  serialize(routerState: RouterStateSnapshot): MinimalRouterStateSnapshot;
}
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/router-store/src/serializers/minimal_serializer.ts#L21-L53)

## Methods

### serialize

```ts
serialize(routerState: RouterStateSnapshot): MinimalRouterStateSnapshot;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/router-store/src/serializers/minimal_serializer.ts#L23-L28)

#### Parameters (#serialize-parameters)

| Name        | Type                  | Description |
| ----------- | --------------------- | ----------- |
| routerState | `RouterStateSnapshot` |             |
