---
kind: FunctionDeclaration
name: defaultSelectId
module: data
---

# defaultSelectId

## description

Default function that returns the entity's primary key (pkey).
Assumes that the entity has an `id` pkey property.
Returns `undefined` if no entity or `id`.
Every selectId fn must return `undefined` when it cannot produce a full pkey.

```ts
function defaultSelectId(entity: any);
```

## Parameters

| Name   | Type  | Description |
| ------ | ----- | ----------- |
| entity | `any` |             |
