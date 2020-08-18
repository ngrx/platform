---
kind: InterfaceDeclaration
name: MemoizedSelectorWithProps
module: store
---

# MemoizedSelectorWithProps

```ts
interface MemoizedSelectorWithProps<
  State,
  Props,
  Result,
  ProjectorFn = DefaultProjectorFn<Result>
> {
  projector: ProjectorFn;
  setResult: (result?: Result) => void;
  clearResult: () => void;
}
```
