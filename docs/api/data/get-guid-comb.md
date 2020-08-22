---
kind: FunctionDeclaration
name: getGuidComb
module: data
---

# getGuidComb

## description

Creates a sortable, pseudo-GUID (globally unique identifier)
whose trailing 6 bytes (12 hex digits) are time-based
Start either with the given getTime() value, seedTime,
or get the current time in ms.

```ts
function getGuidComb(seed?: number);
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/utils/guid-fns.ts#L42-L64)

## Parameters

| Name | Type     | Description                                         |
| ---- | -------- | --------------------------------------------------- |
| seed | `number` | {number} - optional seed for reproducible time-part |
