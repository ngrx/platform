---
kind: FunctionDeclaration
name: reduceState
module: store
---

# reduceState

```ts
function reduceState<T, V extends Action = Action>(
  stateActionPair: StateActionPair<T, V> = { state: undefined },
  [action, reducer]: [V, ActionReducer<T, V>]
): StateActionPair<T, V>;
```

## Parameters

| Name              | Type                       | Description |
| ----------------- | -------------------------- | ----------- |
| stateActionPair   | `StateActionPair<T, V>`    |             |
| [action, reducer] | `[V, ActionReducer<T, V>]` |             |
