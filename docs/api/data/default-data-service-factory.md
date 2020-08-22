---
kind: ClassDeclaration
name: DefaultDataServiceFactory
module: data
---

# DefaultDataServiceFactory

## description

Create a basic, generic entity data service
suitable for persistence of most entities.
Assumes a common REST-y web API

```ts
class DefaultDataServiceFactory {
  create<T>(entityName: string): EntityCollectionDataService<T>;
}
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/dataservices/default-data.service.ts#L202-L225)

## Methods

### create

#### description (#create-description)

Create a default {EntityCollectionDataService} for the given entity type

```ts
create<T>(entityName: string): EntityCollectionDataService<T>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/dataservices/default-data.service.ts#L217-L224)

#### Parameters (#create-parameters)

| Name       | Type     | Description                                            |
| ---------- | -------- | ------------------------------------------------------ |
| entityName | `string` | {string} Name of the entity type for this data service |
