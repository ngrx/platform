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
