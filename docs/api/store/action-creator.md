---
kind: TypeAliasDeclaration
name: ActionCreator
module: store
---

# ActionCreator

## description

See `Creator`.

```ts
export type ActionCreator<
  T extends string = string,
  C extends Creator = Creator
> = C & TypedAction<T>;
```
