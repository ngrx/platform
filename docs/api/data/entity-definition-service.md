---
kind: ClassDeclaration
name: EntityDefinitionService
module: data
---

# EntityDefinitionService

```ts
class EntityDefinitionService {
  getDefinition<T>(entityName: string, shouldThrow = true): EntityDefinition<T>;
  registerMetadata(metadata: EntityMetadata);
  registerMetadataMap(metadataMap: EntityMetadataMap = {});
  registerDefinition<T>(definition: EntityDefinition<T>);
  registerDefinitions(definitions: EntityDefinitions);
}
```
