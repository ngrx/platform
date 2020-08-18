---
kind: FunctionDeclaration
name: PropsFilterFnFactory
module: data
---

# PropsFilterFnFactory

## description

Creates an {EntityFilterFn} that matches RegExp or RegExp string pattern
anywhere in any of the given props of an entity.
If pattern is a string, spaces are significant and ignores case.

```ts
function PropsFilterFnFactory<T = any>(
  props: (keyof T)[] = []
): EntityFilterFn<T>;
```

## Parameters

| Name  | Type          | Description |
| ----- | ------------- | ----------- |
| props | `(keyof T)[]` |             |
