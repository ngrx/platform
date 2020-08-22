---
kind: ClassDeclaration
name: EntityDataService
module: data
---

# EntityDataService

## description

Registry of EntityCollection data services that make REST-like CRUD calls
to entity collection endpoints.

```ts
class EntityDataService {
  getService<T>(entityName: string): EntityCollectionDataService<T>;
  registerService<T>(
    entityName: string,
    service: EntityCollectionDataService<T>
  );
  registerServices(services: {
    [name: string]: EntityCollectionDataService<any>;
  });
}
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/dataservices/entity-data.service.ts#L10-L67)

## Methods

### getService

#### description (#getService-description)

Get (or create) a data service for entity type

```ts
getService<T>(entityName: string): EntityCollectionDataService<T>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/dataservices/entity-data.service.ts#L26-L34)

#### Parameters (#getService-parameters)

| Name       | Type     | Description            |
| ---------- | -------- | ---------------------- |
| entityName | `string` | - the name of the type |

### registerService

#### description (#registerService-description)

Register an EntityCollectionDataService for an entity type

```ts
registerService<T>(  entityName: string,  service: EntityCollectionDataService<T> );
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/dataservices/entity-data.service.ts#L45-L50)

#### Parameters (#registerService-parameters)

| Name       | Type                             | Description                         |
| ---------- | -------------------------------- | ----------------------------------- |
| entityName | `string`                         | - the name of the entity type       |
| service    | `EntityCollectionDataService<T>` | - data service for that entity type |

### registerServices

#### description (#registerServices-description)

Register a batch of data services.

```ts
registerServices(services: {  [name: string]: EntityCollectionDataService<any>; });
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/dataservices/entity-data.service.ts#L62-L66)

#### Parameters (#registerServices-parameters)

| Name     | Type                                                    | Description                                     |
| -------- | ------------------------------------------------------- | ----------------------------------------------- |
| services | `{ [name: string]: EntityCollectionDataService<any>; }` | - data services to merge into existing services |
