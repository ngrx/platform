---
kind: ClassDeclaration
name: DefaultRouterStateSerializer
module: router-store
---

# DefaultRouterStateSerializer

```ts
class DefaultRouterStateSerializer
  implements RouterStateSerializer<SerializedRouterStateSnapshot> {
  serialize(routerState: RouterStateSnapshot): SerializedRouterStateSnapshot;
}
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/router-store/src/serializers/default_serializer.ts#L9-L50)

## Methods

### serialize

```ts
serialize(routerState: RouterStateSnapshot): SerializedRouterStateSnapshot;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/router-store/src/serializers/default_serializer.ts#L11-L16)

#### Parameters (#serialize-parameters)

| Name        | Type                  | Description |
| ----------- | --------------------- | ----------- |
| routerState | `RouterStateSnapshot` |             |
