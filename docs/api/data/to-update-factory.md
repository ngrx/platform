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

## Parameters

| Name     | Type  | Description |
| -------- | ----- | ----------- |
| selectId | `any` |             |
