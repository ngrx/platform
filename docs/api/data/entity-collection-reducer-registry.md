---
kind: ClassDeclaration
name: EntityCollectionReducerRegistry
module: data
---

# EntityCollectionReducerRegistry

## description

Registry of entity types and their previously-constructed reducers.
Can create a new CollectionReducer, which it registers for subsequent use.

```ts
class EntityCollectionReducerRegistry {
  getOrCreateReducer<T>(entityName: string): EntityCollectionReducer<T>;
  registerReducer<T>(
    entityName: string,
    reducer: EntityCollectionReducer<T>
  ): EntityCollectionReducer<T>;
  registerReducers(reducers: EntityCollectionReducers);
}
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/reducers/entity-collection-reducer-registry.ts#L21-L89)

## Methods

### getOrCreateReducer

#### description (#getOrCreateReducer-description)

Get the registered EntityCollectionReducer<T> for this entity type or create one and register it.

```ts
getOrCreateReducer<T>(entityName: string): EntityCollectionReducer<T>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/reducers/entity-collection-reducer-registry.ts#L45-L56)

#### Parameters (#getOrCreateReducer-parameters)

| Name       | Type     | Description                              |
| ---------- | -------- | ---------------------------------------- |
| entityName | `string` | Name of the entity type for this reducer |

### registerReducer

#### description (#registerReducer-description)

Register an EntityCollectionReducer for an entity type

```ts
registerReducer<T>(  entityName: string,  reducer: EntityCollectionReducer<T> ): EntityCollectionReducer<T>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/reducers/entity-collection-reducer-registry.ts#L67-L73)

#### Parameters (#registerReducer-parameters)

| Name       | Type                         | Description                    |
| ---------- | ---------------------------- | ------------------------------ |
| entityName | `string`                     | - the name of the entity type  |
| reducer    | `EntityCollectionReducer<T>` | - reducer for that entity type |

### registerReducers

#### description (#registerReducers-description)

Register a batch of EntityCollectionReducers.

```ts
registerReducers(reducers: EntityCollectionReducers);
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/reducers/entity-collection-reducer-registry.ts#L85-L88)

#### Parameters (#registerReducers-parameters)

| Name     | Type                       | Description                                |
| -------- | -------------------------- | ------------------------------------------ |
| reducers | `EntityCollectionReducers` | - reducers to merge into existing reducers |
