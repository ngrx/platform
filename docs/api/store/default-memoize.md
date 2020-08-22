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

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store/src/selector.ts#L67-L119)

## Parameters

| Name             | Type                  | Description |
| ---------------- | --------------------- | ----------- |
| projectionFn     | `AnyFn`               |             |
| isArgumentsEqual | `typeof isEqualCheck` |             |
| isResultEqual    | `typeof isEqualCheck` |             |
