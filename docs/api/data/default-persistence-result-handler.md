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

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/dataservices/persistence-result-handler.service.ts#L32-L72)

## Methods

### handleSuccess

```ts
handleSuccess(originalAction: EntityAction): (data: any) => Action;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/dataservices/persistence-result-handler.service.ts#L41-L48)

#### Parameters (#handleSuccess-parameters)

| Name           | Type                | Description |
| -------------- | ------------------- | ----------- |
| originalAction | `EntityAction<any>` |             |

### handleError

```ts
handleError(  originalAction: EntityAction ): (  error: DataServiceError | Error ) => EntityAction<EntityActionDataServiceError>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/dataservices/persistence-result-handler.service.ts#L51-L71)

#### Parameters (#handleError-parameters)

| Name           | Type                | Description |
| -------------- | ------------------- | ----------- |
| originalAction | `EntityAction<any>` |             |
