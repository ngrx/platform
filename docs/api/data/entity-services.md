---
kind: ClassDeclaration
name: EntityServices
module: data
---

# EntityServices

## description

Class-Interface for EntityCache and EntityCollection services.
Serves as an Angular provider token for this service class.
Includes a registry of EntityCollectionServices for all entity types.
Creates a new default EntityCollectionService for any entity type not in the registry.
Optionally register specialized EntityCollectionServices for individual types

```ts
class EntityServices {
  abstract readonly entityActionErrors$: Observable<EntityAction>;
  abstract readonly entityCache$: Observable<EntityCache> | Store<EntityCache>;
  abstract readonly reducedActions$: Observable<Action>;

  abstract dispatch(action: Action): void;
  abstract getEntityCollectionService<T = any>(
    entityName: string
  ): EntityCollectionService<T>;
  abstract registerEntityCollectionService<T>(
    service: EntityCollectionService<T>
  ): void;
  abstract registerEntityCollectionServices(
    entityCollectionServices: EntityCollectionService<any>[]
  ): void;
  abstract registerEntityCollectionServices(
    entityCollectionServiceMap: EntityCollectionServiceMap
  ): void;
}
```
