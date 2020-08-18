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
