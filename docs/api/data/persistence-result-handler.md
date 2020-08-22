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

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/dataservices/persistence-result-handler.service.ts#L16-L26)

## Methods

### handleSuccess

```ts
abstract handleSuccess(originalAction: EntityAction): (data: any) => Action;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/dataservices/persistence-result-handler.service.ts#L18-L18)

#### Parameters (#handleSuccess-parameters)

| Name           | Type                | Description |
| -------------- | ------------------- | ----------- |
| originalAction | `EntityAction<any>` |             |

### handleError

```ts
abstract handleError(  originalAction: EntityAction ): (  error: DataServiceError | Error ) => EntityAction<EntityActionDataServiceError>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/dataservices/persistence-result-handler.service.ts#L21-L25)

#### Parameters (#handleError-parameters)

| Name           | Type                | Description |
| -------------- | ------------------- | ----------- |
| originalAction | `EntityAction<any>` |             |
