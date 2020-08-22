---
kind: TypeAliasDeclaration
name: SelectorWithProps
module: store
---

# SelectorWithProps

```ts
export type SelectorWithProps<State, Props, Result> = (
  state: State,
  props: Props
) => Result;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store/src/models.ts#L51-L54)
