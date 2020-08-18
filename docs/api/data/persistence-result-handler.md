---
kind: ClassDeclaration
name: PersistenceResultHandler
module: data
---

# PersistenceResultHandler

## description

Handling of responses from persistence operation

```ts
class PersistenceResultHandler {
  abstract handleSuccess(originalAction: EntityAction): (data: any) => Action;
  abstract handleError(
    originalAction: EntityAction
  ): (
    error: DataServiceError | Error
  ) => EntityAction<EntityActionDataServiceError>;
}
```
