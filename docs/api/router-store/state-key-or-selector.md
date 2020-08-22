---
kind: TypeAliasDeclaration
name: StateKeyOrSelector
module: router-store
---

# StateKeyOrSelector

```ts
export type StateKeyOrSelector<
  T extends BaseRouterStoreState = SerializedRouterStateSnapshot
> = string | Selector<any, RouterReducerState<T>>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/router-store/src/router_store_module.ts#L39-L41)
