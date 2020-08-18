---
kind: TypeAliasDeclaration
name: MetaReducer
module: store
---

# MetaReducer

```ts
export type MetaReducer<T = any, V extends Action = Action> = (
  reducer: ActionReducer<T, V>
) => ActionReducer<T, V>;
```
