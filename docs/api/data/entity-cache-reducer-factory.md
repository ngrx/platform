---
kind: ClassDeclaration
name: EntityCacheReducerFactory
module: data
---

# EntityCacheReducerFactory

## description

Creates the EntityCacheReducer via its create() method

```ts
class EntityCacheReducerFactory {
  create(): ActionReducer<EntityCache, Action>;
}
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/reducers/entity-cache-reducer.ts#L33-L382)

## Methods

### create

#### description (#create-description)

Create the @ngrx/data entity cache reducer which either responds to entity cache level actions
or (more commonly) delegates to an EntityCollectionReducer based on the action.payload.entityName.

```ts
create(): ActionReducer<EntityCache, Action>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/reducers/entity-cache-reducer.ts#L45-L117)
