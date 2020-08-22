---
kind: ClassDeclaration
name: EntitySelectorsFactory
module: data
---

# EntitySelectorsFactory

```ts
class EntitySelectorsFactory {
  createCollectionSelector<
    T = any,
    C extends EntityCollection<T> = EntityCollection<T>
  >(entityName: string);
  createCollectionSelectors<
    T,
    S extends CollectionSelectors<T> = CollectionSelectors<T>
  >(metadataOrName: EntityMetadata<T> | string): S;
  createCollectionSelectors<
    T,
    S extends CollectionSelectors<T> = CollectionSelectors<T>
  >(metadata: EntityMetadata<T>): S;
  createCollectionSelectors<
    T,
    S extends CollectionSelectors<T> = CollectionSelectors<T>
  >(entityName: string): S;
  create<T, S extends EntitySelectors<T> = EntitySelectors<T>>(
    metadataOrName: EntityMetadata<T> | string
  ): S;
  create<T, S extends EntitySelectors<T> = EntitySelectors<T>>(
    metadata: EntityMetadata<T>
  ): S;
  create<T, S extends EntitySelectors<T> = EntitySelectors<T>>(
    entityName: string
  ): S;
}
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/selectors/entity-selectors.ts#L104-L302)

## Methods

### createCollectionSelector

#### description (#createCollectionSelector-description)

Create the NgRx selector from the store root to the named collection,
e.g. from Object to Heroes.

```ts
createCollectionSelector<  T = any,  C extends EntityCollection<T> = EntityCollection<T> >(entityName: string);
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/selectors/entity-selectors.ts#L126-L136)

#### Parameters (#createCollectionSelector-parameters)

| Name       | Type     | Description                |
| ---------- | -------- | -------------------------- |
| entityName | `string` | the name of the collection |

### createCollectionSelectors

```ts
createCollectionSelectors<  T,  S extends CollectionSelectors<T> = CollectionSelectors<T> >(metadataOrName: EntityMetadata<T> | string): S;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/selectors/entity-selectors.ts#L167-L233)

#### Parameters (#createCollectionSelectors-parameters)

| Name           | Type                             | Description |
| -------------- | -------------------------------- | ----------- |
| metadataOrName | `string | EntityMetadata<T, {}>` |             |

### createCollectionSelectors

#### description (#createCollectionSelectors-description)

Creates entity collection selectors from metadata.

```ts
createCollectionSelectors<  T,  S extends CollectionSelectors<T> = CollectionSelectors<T> >(metadata: EntityMetadata<T>): S;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/selectors/entity-selectors.ts#L149-L152)

#### Parameters (#createCollectionSelectors-parameters)

| Name     | Type                    | Description                          |
| -------- | ----------------------- | ------------------------------------ |
| metadata | `EntityMetadata<T, {}>` | - EntityMetadata for the collection. |

### createCollectionSelectors

#### description (#createCollectionSelectors-description)

Creates default entity collection selectors for an entity type.
Use the metadata overload for additional collection selectors.

```ts
createCollectionSelectors<  T,  S extends CollectionSelectors<T> = CollectionSelectors<T> >(entityName: string): S;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/selectors/entity-selectors.ts#L161-L164)

#### Parameters (#createCollectionSelectors-parameters)

| Name       | Type     | Description               |
| ---------- | -------- | ------------------------- |
| entityName | `string` | - name of the entity type |

### create

```ts
create<T, S extends EntitySelectors<T> = EntitySelectors<T>>(  metadataOrName: EntityMetadata<T> | string ): S;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/selectors/entity-selectors.ts#L271-L301)

#### Parameters (#create-parameters)

| Name           | Type                             | Description |
| -------------- | -------------------------------- | ----------- |
| metadataOrName | `string | EntityMetadata<T, {}>` |             |

### create

#### description (#create-description)

Creates the store-rooted selectors for an entity collection.
{EntitySelectors$Factory} turns them into selectors$.

```ts
create<T, S extends EntitySelectors<T> = EntitySelectors<T>>(  metadata: EntityMetadata<T> ): S;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/selectors/entity-selectors.ts#L249-L251)

#### Parameters (#create-parameters)

| Name     | Type                    | Description                          |
| -------- | ----------------------- | ------------------------------------ |
| metadata | `EntityMetadata<T, {}>` | - EntityMetadata for the collection. |

### create

#### description (#create-description)

Creates the default store-rooted selectors for an entity collection.
{EntitySelectors$Factory} turns them into selectors$.
Use the metadata overload for additional collection selectors.

```ts
create<T, S extends EntitySelectors<T> = EntitySelectors<T>>(  entityName: string ): S;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/selectors/entity-selectors.ts#L265-L268)

#### Parameters (#create-parameters)

| Name       | Type     | Description                |
| ---------- | -------- | -------------------------- |
| entityName | `string` | - name of the entity type. |
