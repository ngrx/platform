---
kind: FunctionDeclaration
name: createEntityAdapter
module: entity
---

# createEntityAdapter

```ts
function createEntityAdapter<T>(
  options: {
    selectId?: IdSelector<T>;
    sortComparer?: false | Comparer<T>;
  } = {}
): EntityAdapter<T>;
```

## Parameters

| Name    | Type                                                                | Description |
| ------- | ------------------------------------------------------------------- | ----------- |
| options | `{ selectId?: IdSelector<T>; sortComparer?: false | Comparer<T>; }` |             |
