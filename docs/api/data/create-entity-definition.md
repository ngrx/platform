---
kind: FunctionDeclaration
name: createEntityDefinition
module: data
---

# createEntityDefinition

```ts
function createEntityDefinition<T, S extends object>(
  metadata: EntityMetadata<T, S>
): EntityDefinition<T>;
```

## Parameters

| Name     | Type                   | Description |
| -------- | ---------------------- | ----------- |
| metadata | `EntityMetadata<T, S>` |             |
