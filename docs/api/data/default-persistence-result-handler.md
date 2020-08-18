---
kind: ClassDeclaration
name: DefaultPersistenceResultHandler
module: data
---

# DefaultPersistenceResultHandler

## description

Default handling of responses from persistence operation,
specifically an EntityDataService

```ts
class DefaultPersistenceResultHandler implements PersistenceResultHandler {
  handleSuccess(originalAction: EntityAction): (data: any) => Action;
  handleError(
    originalAction: EntityAction
  ): (
    error: DataServiceError | Error
  ) => EntityAction<EntityActionDataServiceError>;
}
```
