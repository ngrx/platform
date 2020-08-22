---
kind: FunctionDeclaration
name: flattenArgs
module: data
---

# flattenArgs

## description

Flatten first arg if it is an array
Allows fn with ...rest signature to be called with an array instead of spread
Example:

```
// See entity-action-operators.ts
const persistOps = [EntityOp.QUERY_ALL, EntityOp.ADD, ...];
actions.pipe(ofEntityOp(...persistOps)) // works
actions.pipe(ofEntityOp(persistOps)) // also works
```

\*/

```ts
function flattenArgs<T>(args?: any[]): T[];
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/utils/utilities.ts#L24-L33)

## Parameters

| Name | Type    | Description |
| ---- | ------- | ----------- |
| args | `any[]` |             |
