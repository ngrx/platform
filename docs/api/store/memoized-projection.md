---
kind: TypeAliasDeclaration
name: MemoizedProjection
module: store
---

# MemoizedProjection

```ts
export type MemoizedProjection = {
  memoized: AnyFn;
  reset: () => void;
  setResult: (result?: any) => void;
  clearResult: () => void;
};
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store/src/selector.ts#L7-L12)
