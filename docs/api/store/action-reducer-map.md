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

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store/src/models.ts#L26-L28)
