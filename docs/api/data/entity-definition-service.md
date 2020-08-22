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

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/entity-metadata/entity-definition.service.ts#L15-L108)

## Methods

### getDefinition

#### description (#getDefinition-description)

Get (or create) a data service for entity type

```ts
getDefinition<T>(  entityName: string,  shouldThrow = true ): EntityDefinition<T>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/entity-metadata/entity-definition.service.ts#L38-L48)

#### Parameters (#getDefinition-parameters)

| Name        | Type      | Description            |
| ----------- | --------- | ---------------------- |
| entityName  | `string`  | - the name of the type |
| shouldThrow | `boolean` |                        |

### registerMetadata

#### description (#registerMetadata-description)

Create and register the {EntityDefinition} for the {EntityMetadata} of an entity type

```ts
registerMetadata(metadata: EntityMetadata);
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/entity-metadata/entity-definition.service.ts#L60-L65)

#### Parameters (#registerMetadata-parameters)

| Name       | Type                                                          | Description |
| ---------- | ------------------------------------------------------------- | ----------- |
| name       | `` | - the name of the entity type                            |
| definition | `` | - {EntityMetadata} for a collection for that entity type |
| metadata   | `EntityMetadata<any, {}>`                                     |             |

### registerMetadataMap

#### description (#registerMetadataMap-description)

Register an EntityMetadataMap.

```ts
registerMetadataMap(metadataMap: EntityMetadataMap = {});
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/entity-metadata/entity-definition.service.ts#L77-L82)

#### Parameters (#registerMetadataMap-parameters)

| Name        | Type                | Description                                    |
| ----------- | ------------------- | ---------------------------------------------- |
| metadataMap | `EntityMetadataMap` | - a map of entityType names to entity metadata |

### registerDefinition

#### description (#registerDefinition-description)

Register an {EntityDefinition} for an entity type

```ts
registerDefinition<T>(definition: EntityDefinition<T>);
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/entity-metadata/entity-definition.service.ts#L91-L93)

#### Parameters (#registerDefinition-parameters)

| Name       | Type                  | Description                                             |
| ---------- | --------------------- | ------------------------------------------------------- |
| definition | `EntityDefinition<T>` | - EntityDefinition of a collection for that entity type |

### registerDefinitions

#### description (#registerDefinitions-description)

Register a batch of EntityDefinitions.

```ts
registerDefinitions(definitions: EntityDefinitions);
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/entity-metadata/entity-definition.service.ts#L105-L107)

#### Parameters (#registerDefinitions-parameters)

| Name        | Type                | Description                                                         |
| ----------- | ------------------- | ------------------------------------------------------------------- |
| definitions | `EntityDefinitions` | - map of entityType name and associated EntityDefinitions to merge. |
