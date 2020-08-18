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
