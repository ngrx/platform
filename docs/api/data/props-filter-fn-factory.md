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

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/entity-metadata/entity-filters.ts#L13-L34)

## Parameters

| Name  | Type          | Description |
| ----- | ------------- | ----------- |
| props | `(keyof T)[]` |             |
