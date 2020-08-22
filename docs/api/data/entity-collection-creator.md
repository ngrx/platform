---
kind: ClassDeclaration
name: EntityCollectionCreator
module: data
---

# EntityCollectionCreator

```ts
class EntityCollectionCreator {
  create<T = any, S extends EntityCollection<T> = EntityCollection<T>>(
    entityName: string
  ): S;
}
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/reducers/entity-collection-creator.ts#L6-L30)

## Methods

### create

#### description (#create-description)

Create the default collection for an entity type.

```ts
create<T = any, S extends EntityCollection<T> = EntityCollection<T>>(  entityName: string ): S;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/reducers/entity-collection-creator.ts#L16-L29)

#### Parameters (#create-parameters)

| Name       | Type     | Description               |
| ---------- | -------- | ------------------------- |
| entityName | `string` | {string} entity type name |
