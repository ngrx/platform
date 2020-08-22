---
kind: TypeAliasDeclaration
name: Creator
module: store
---

# Creator

## description

A function that returns an object in the shape of the `Action` interface. Configured using `createAction`.

```ts
export type Creator<
  P extends any[] = any[],
  R extends object = object
> = FunctionWithParametersType<P, R>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store/src/models.ts#L71-L74)
