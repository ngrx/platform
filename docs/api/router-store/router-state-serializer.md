---
kind: ClassDeclaration
name: RouterStateSerializer
module: router-store
---

# RouterStateSerializer

```ts
class RouterStateSerializer<
  T extends BaseRouterStoreState = BaseRouterStoreState
> {
  abstract serialize(routerState: RouterStateSnapshot): T;
}
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/router-store/src/serializers/base.ts#L12-L16)

## Methods

### serialize

```ts
abstract serialize(routerState: RouterStateSnapshot): T;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/router-store/src/serializers/base.ts#L15-L15)

#### Parameters (#serialize-parameters)

| Name        | Type                  | Description |
| ----------- | --------------------- | ----------- |
| routerState | `RouterStateSnapshot` |             |
