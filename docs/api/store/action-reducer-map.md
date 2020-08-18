---
kind: TypeAliasDeclaration
name: ActionReducerMap
module: store
---

# ActionReducerMap

```ts
export type ActionReducerMap<T, V extends Action = Action> = {
  [p in keyof T]: ActionReducer<T[p], V>;
};
```
