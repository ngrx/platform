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
