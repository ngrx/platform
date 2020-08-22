---
kind: ClassDeclaration
name: EntityServicesBase
module: data
---

# EntityServicesBase

## description

Base/default class of a central registry of EntityCollectionServices for all entity types.
Create your own subclass to add app-specific members for an improved developer experience.

```ts
class EntityServicesBase implements EntityServices {
  dispatch(action: Action);
  getEntityCollectionService<
    T,
    S$ extends EntitySelectors$<T> = EntitySelectors$<T>
  >(entityName: string): EntityCollectionService<T>;
  registerEntityCollectionService<T>(
    service: EntityCollectionService<T>,
    serviceName?: string
  );
  registerEntityCollectionServices(
    entityCollectionServices:
      | EntityCollectionServiceMap
      | EntityCollectionService<any>[]
  ): void;
}
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/entity-services/entity-services-base.ts#L36-L151)

## example

export class EntityServices extends EntityServicesBase {
constructor(entityServicesElements: EntityServicesElements) {
super(entityServicesElements);
}
// Extend with well-known, app entity collection services
// Convenience property to return a typed custom entity collection service
get companyService() {
return this.getEntityCollectionService<Model.Company>('Company') as CompanyService;
}
// Convenience dispatch methods
clearCompany(companyId: string) {
this.dispatch(new ClearCompanyAction(companyId));
}
}

## Methods

### dispatch

```ts
dispatch(action: Action);
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/entity-services/entity-services-base.ts#L80-L82)

#### Parameters (#dispatch-parameters)

| Name   | Type  | Description |
| ------ | ----- | ----------- |
| action | `any` |             |

### getEntityCollectionService

```ts
getEntityCollectionService<  T,  S$ extends EntitySelectors$<T> = EntitySelectors$<T> >(entityName: string): EntityCollectionService<T>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/entity-services/entity-services-base.ts#L103-L113)

#### Parameters (#getEntityCollectionService-parameters)

| Name       | Type     | Description                                     |
| ---------- | -------- | ----------------------------------------------- |
| entityName | `string` | {string} Name of the entity type of the service |

### registerEntityCollectionService

#### description (#registerEntityCollectionService-description)

Will replace a pre-existing service for that type.

```ts
registerEntityCollectionService<T>(  service: EntityCollectionService<T>,  serviceName?: string );
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/entity-services/entity-services-base.ts#L120-L125)

#### Parameters (#registerEntityCollectionService-parameters)

| Name        | Type                         | Description                                                               |
| ----------- | ---------------------------- | ------------------------------------------------------------------------- |
| service     | `EntityCollectionService<T>` | {EntityCollectionService} The entity service                              |
| serviceName | `string`                     | {string} optional service name to use instead of the service's entityName |

### registerEntityCollectionServices

#### description (#registerEntityCollectionServices-description)

Register entity services for several entity types at once.
Will replace a pre-existing service for that type.

```ts
registerEntityCollectionServices(  entityCollectionServices:   | EntityCollectionServiceMap   | EntityCollectionService<any>[] ): void;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/entity-services/entity-services-base.ts#L133-L150)

#### Parameters (#registerEntityCollectionServices-parameters)

| Name                     | Type                                                          | Description                 |
| ------------------------ | ------------------------------------------------------------- | --------------------------- |
| entityCollectionServices | `EntityCollectionServiceMap | EntityCollectionService<any>[]` | {EntityCollectionServiceMap | EntityCollectionService<any>[]} |
