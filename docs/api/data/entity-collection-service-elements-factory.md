---
kind: ClassDeclaration
name: EntityCollectionServiceElementsFactory
module: data
---

# EntityCollectionServiceElementsFactory

```ts
class EntityCollectionServiceElementsFactory {
  create<T, S$ extends EntitySelectors$<T> = EntitySelectors$<T>>(
    entityName: string
  ): EntityCollectionServiceElements<T, S$>;
}
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/entity-services/entity-collection-service-elements-factory.ts#L26-L65)

## Methods

### create

#### description (#create-description)

Get the ingredients for making an EntityCollectionService for this entity type

```ts
create<T, S$ extends EntitySelectors$<T> = EntitySelectors$<T>>(  entityName: string ): EntityCollectionServiceElements<T, S$>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/entity-services/entity-collection-service-elements-factory.ts#L39-L64)

#### Parameters (#create-parameters)

| Name       | Type     | Description               |
| ---------- | -------- | ------------------------- |
| entityName | `string` | - name of the entity type |
