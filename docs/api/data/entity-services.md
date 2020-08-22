---
kind: ClassDeclaration
name: EntityServices
module: data
---

# EntityServices

## description

Class-Interface for EntityCache and EntityCollection services.
Serves as an Angular provider token for this service class.
Includes a registry of EntityCollectionServices for all entity types.
Creates a new default EntityCollectionService for any entity type not in the registry.
Optionally register specialized EntityCollectionServices for individual types

```ts
class EntityServices {
  abstract readonly entityActionErrors$: Observable<EntityAction>;
  abstract readonly entityCache$: Observable<EntityCache> | Store<EntityCache>;
  abstract readonly reducedActions$: Observable<Action>;

  abstract dispatch(action: Action): void;
  abstract getEntityCollectionService<T = any>(
    entityName: string
  ): EntityCollectionService<T>;
  abstract registerEntityCollectionService<T>(
    service: EntityCollectionService<T>
  ): void;
  abstract registerEntityCollectionServices(
    entityCollectionServices: EntityCollectionService<any>[]
  ): void;
  abstract registerEntityCollectionServices(
    entityCollectionServiceMap: EntityCollectionServiceMap
  ): void;
  abstract registerEntityCollectionServices(
    entityCollectionServices: EntityCollectionService<any>[]
  ): void;
  abstract registerEntityCollectionServices(
    entityCollectionServiceMap: EntityCollectionServiceMap
  ): void;
}
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/entity-services/entity-services.ts#L17-L67)

## Methods

### dispatch

```ts
abstract dispatch(action: Action): void;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/entity-services/entity-services.ts#L19-L19)

#### Parameters (#dispatch-parameters)

| Name   | Type  | Description |
| ------ | ----- | ----------- |
| action | `any` |             |

### getEntityCollectionService

```ts
abstract getEntityCollectionService<T = any>(  entityName: string ): EntityCollectionService<T>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/entity-services/entity-services.ts#L30-L32)

#### Parameters (#getEntityCollectionService-parameters)

| Name       | Type     | Description                                     |
| ---------- | -------- | ----------------------------------------------- |
| entityName | `string` | {string} Name of the entity type of the service |

### registerEntityCollectionService

#### description (#registerEntityCollectionService-description)

Will replace a pre-existing service for that type.

```ts
abstract registerEntityCollectionService<T>(  service: EntityCollectionService<T> ): void;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/entity-services/entity-services.ts#L46-L48)

#### Parameters (#registerEntityCollectionService-parameters)

| Name    | Type                         | Description                                  |
| ------- | ---------------------------- | -------------------------------------------- |
| service | `EntityCollectionService<T>` | {EntityCollectionService} The entity service |

### registerEntityCollectionServices

#### description (#registerEntityCollectionServices-description)

Will replace a pre-existing service for that type.

```ts
abstract registerEntityCollectionServices(  entityCollectionServices: EntityCollectionService<any>[] ): void;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/entity-services/entity-services.ts#L54-L56)

#### Parameters (#registerEntityCollectionServices-parameters)

| Name                     | Type                             | Description                                   |
| ------------------------ | -------------------------------- | --------------------------------------------- |
| entityCollectionServices | `EntityCollectionService<any>[]` | Array of EntityCollectionServices to register |

### registerEntityCollectionServices

#### description (#registerEntityCollectionServices-description)

Will replace a pre-existing service for that type.

```ts
abstract registerEntityCollectionServices(  entityCollectionServiceMap: EntityCollectionServiceMap ): void;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/entity-services/entity-services.ts#L62-L65)

#### Parameters (#registerEntityCollectionServices-parameters)

| Name                       | Type                         | Description                                      |
| -------------------------- | ---------------------------- | ------------------------------------------------ |
| entityCollectionServiceMap | `EntityCollectionServiceMap` | Map of service-name to entity-collection-service |

### registerEntityCollectionServices

#### description (#registerEntityCollectionServices-description)

Will replace a pre-existing service for that type.

```ts
abstract registerEntityCollectionServices(  entityCollectionServices: EntityCollectionService<any>[] ): void;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/entity-services/entity-services.ts#L54-L56)

#### Parameters (#registerEntityCollectionServices-parameters)

| Name                     | Type                             | Description                                   |
| ------------------------ | -------------------------------- | --------------------------------------------- |
| entityCollectionServices | `EntityCollectionService<any>[]` | Array of EntityCollectionServices to register |

### registerEntityCollectionServices

#### description (#registerEntityCollectionServices-description)

Will replace a pre-existing service for that type.

```ts
abstract registerEntityCollectionServices(  entityCollectionServiceMap: EntityCollectionServiceMap ): void;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/entity-services/entity-services.ts#L62-L65)

#### Parameters (#registerEntityCollectionServices-parameters)

| Name                       | Type                         | Description                                      |
| -------------------------- | ---------------------------- | ------------------------------------------------ |
| entityCollectionServiceMap | `EntityCollectionServiceMap` | Map of service-name to entity-collection-service |

## Parameters

| Name                 | Type                            | Description                                                                           |
| -------------------- | ------------------------------- | ------------------------------------------------------------------------------------- |
| entityActionErrors\$ | `Observable<EntityAction<any>>` | /\*_ Observable of error EntityActions (e.g. QUERY_ALL_ERROR) for all entity types _/ |
| entityCache\$        | `any`                           | /\*_ Observable of the entire entity cache _/                                         |
| reducedActions\$     | `Observable<any>`               | /\*\*                                                                                 |

- Actions scanned by the store after it processed them with reducers.
- A replay observable of the most recent Action (not just EntityAction) reduced by the store.
  \*/ |
