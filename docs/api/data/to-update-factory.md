---
kind: FunctionDeclaration
name: toUpdateFactory
module: data
---

# toUpdateFactory

## description

Return a function that converts an entity (or partial entity) into the `Update<T>`
whose `id` is the primary key and
`changes` is the entity (or partial entity of changes).

```ts
function toUpdateFactory<T>(selectId?: IdSelector<T>);
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/utils/utilities.ts#L40-L55)

## Parameters

| Name     | Type  | Description |
| -------- | ----- | ----------- |
| selectId | `any` |             |
