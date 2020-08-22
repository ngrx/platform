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

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store/src/models.ts#L10-L12)
