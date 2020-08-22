---
kind: ClassDeclaration
name: EntityCollectionReducerMethodsFactory
module: data
---

# EntityCollectionReducerMethodsFactory

## description

Creates {EntityCollectionReducerMethods} for a given entity type.

```ts
class EntityCollectionReducerMethodsFactory {
  create<T>(entityName: string): EntityCollectionReducerMethodMap<T>;
}
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/reducers/entity-collection-reducer-methods.ts#L1226-L1242)

## Methods

### create

```ts
create<T>(entityName: string): EntityCollectionReducerMethodMap<T>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/reducers/entity-collection-reducer-methods.ts#L1231-L1241)

#### Parameters (#create-parameters)

| Name       | Type     | Description |
| ---------- | -------- | ----------- |
| entityName | `string` |             |
