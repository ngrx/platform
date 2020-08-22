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

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/entity/src/create_adapter.ts#L13-L38)

## Parameters

| Name    | Type                                                                | Description |
| ------- | ------------------------------------------------------------------- | ----------- |
| options | `{ selectId?: IdSelector<T>; sortComparer?: false | Comparer<T>; }` |             |
