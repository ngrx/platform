---
kind: FunctionDeclaration
name: defaultMemoize
module: store
---

# defaultMemoize

```ts
function defaultMemoize(
  projectionFn: AnyFn,
  isArgumentsEqual = isEqualCheck,
  isResultEqual = isEqualCheck
): MemoizedProjection;
```

## Parameters

| Name             | Type                  | Description |
| ---------------- | --------------------- | ----------- |
| projectionFn     | `AnyFn`               |             |
| isArgumentsEqual | `typeof isEqualCheck` |             |
| isResultEqual    | `typeof isEqualCheck` |             |
