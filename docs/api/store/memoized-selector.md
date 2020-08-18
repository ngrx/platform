---
kind: InterfaceDeclaration
name: MemoizedSelector
module: store
---

# MemoizedSelector

```ts
interface MemoizedSelector<
  State,
  Result,
  ProjectorFn = DefaultProjectorFn<Result>
> {
  projector: ProjectorFn;
  setResult: (result?: Result) => void;
  clearResult: () => void;
}
```
