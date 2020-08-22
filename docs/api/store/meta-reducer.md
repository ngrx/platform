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

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store/src/models.ts#L37-L39)
