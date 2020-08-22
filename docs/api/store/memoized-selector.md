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

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store/src/selector.ts#L20-L29)
