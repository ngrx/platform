---
kind: ClassDeclaration
name: EntityServicesBase
module: data
---

# EntityServicesBase

## description

Base/default class of a central registry of EntityCollectionServices for all entity types.
Create your own subclass to add app-specific members for an improved developer experience.

```ts
class EntityServicesBase implements EntityServices {
  dispatch(action: Action);
  getEntityCollectionService<
    T,
    S$ extends EntitySelectors$<T> = EntitySelectors$<T>
  >(entityName: string): EntityCollectionService<T>;
  registerEntityCollectionService<T>(
    service: EntityCollectionService<T>,
    serviceName?: string
  );
  registerEntityCollectionServices(
    entityCollectionServices:
      | EntityCollectionServiceMap
      | EntityCollectionService<any>[]
  ): void;
}
```

## example

export class EntityServices extends EntityServicesBase {
constructor(entityServicesElements: EntityServicesElements) {
super(entityServicesElements);
}
// Extend with well-known, app entity collection services
// Convenience property to return a typed custom entity collection service
get companyService() {
return this.getEntityCollectionService<Model.Company>('Company') as CompanyService;
}
// Convenience dispatch methods
clearCompany(companyId: string) {
this.dispatch(new ClearCompanyAction(companyId));
}
}
