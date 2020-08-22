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

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store/src/selector.ts#L515-L530)

## Parameters

| Name              | Type                                                        | Description |
| ----------------- | ----------------------------------------------------------- | ----------- |
| state             | `any`                                                       |             |
| selectors         | `Selector<any, any>[] | SelectorWithProps<any, any, any>[]` |             |
| props             | `any`                                                       |             |
| memoizedProjector | `MemoizedProjection`                                        |             |
