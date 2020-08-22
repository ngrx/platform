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

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/entity-metadata/entity-definition.ts#L20-L57)

## Parameters

| Name     | Type                   | Description |
| -------- | ---------------------- | ----------- |
| metadata | `EntityMetadata<T, S>` |             |
