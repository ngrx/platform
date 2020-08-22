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

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store/src/models.ts#L85-L88)
