---
kind: ClassDeclaration
name: EntityCollectionServiceFactory
module: data
---

# EntityCollectionServiceFactory

## description

Creates EntityCollectionService instances for
a cached collection of T entities in the ngrx store.

```ts
class EntityCollectionServiceFactory {
  create<T, S$ extends EntitySelectors$<T> = EntitySelectors$<T>>(
    entityName: string
  ): EntityCollectionService<T>;
}
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/entity-services/entity-collection-service-factory.ts#L11-L30)

## Methods

### create

#### description (#create-description)

Create an EntityCollectionService for an entity type

```ts
create<T, S$ extends EntitySelectors$<T> = EntitySelectors$<T>>(  entityName: string ): EntityCollectionService<T>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/entity-services/entity-collection-service-factory.ts#L22-L29)

#### Parameters (#create-parameters)

| Name       | Type     | Description               |
| ---------- | -------- | ------------------------- |
| entityName | `string` | - name of the entity type |
