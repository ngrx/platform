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

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/utils/utilities.ts#L9-L11)

## Parameters

| Name   | Type  | Description |
| ------ | ----- | ----------- |
| entity | `any` |             |
