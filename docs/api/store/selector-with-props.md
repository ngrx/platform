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
