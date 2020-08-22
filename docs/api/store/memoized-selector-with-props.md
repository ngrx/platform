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

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store/src/selector.ts#L31-L41)
