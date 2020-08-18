---
kind: TypeAliasDeclaration
name: ActionType
module: store
---

# ActionType

```ts
export type ActionType<A> = A extends ActionCreator<infer T, infer C>
  ? ReturnType<C> & { type: T }
  : never;
```
