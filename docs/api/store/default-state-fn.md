---
kind: FunctionDeclaration
name: defaultStateFn
module: store
---

# defaultStateFn

```ts
function defaultStateFn(
  state: any,
  selectors: Selector<any, any>[] | SelectorWithProps<any, any, any>[],
  props: any,
  memoizedProjector: MemoizedProjection
): any;
```

## Parameters

| Name              | Type                                                        | Description |
| ----------------- | ----------------------------------------------------------- | ----------- |
| state             | `any`                                                       |             |
| selectors         | `Selector<any, any>[] | SelectorWithProps<any, any, any>[]` |             |
| props             | `any`                                                       |             |
| memoizedProjector | `MemoizedProjection`                                        |             |
