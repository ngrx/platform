---
kind: ClassDeclaration
name: EntityDataService
module: data
---

# EntityDataService

## description

Registry of EntityCollection data services that make REST-like CRUD calls
to entity collection endpoints.

```ts
class EntityDataService {
  getService<T>(entityName: string): EntityCollectionDataService<T>;
  registerService<T>(
    entityName: string,
    service: EntityCollectionDataService<T>
  );
  registerServices(services: {
    [name: string]: EntityCollectionDataService<any>;
  });
}
```
