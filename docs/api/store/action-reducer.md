---
kind: InterfaceDeclaration
name: ActionReducer
module: store
---

# ActionReducer

## description

A function that takes an `Action` and a `State`, and returns a `State`.
See `createReducer`.

```ts
interface ActionReducer<T, V extends Action = Action> {}
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store/src/models.ts#L22-L24)
