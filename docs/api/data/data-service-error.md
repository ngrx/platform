---
kind: ClassDeclaration
name: DataServiceError
module: data
---

# DataServiceError

## description

Error from a DataService
The source error either comes from a failed HTTP response or was thrown within the service.

```ts
class DataServiceError {
  message: string | null;
}
```

## Parameters

| Name        | Type                                                              | Description |
| ----------- | ----------------------------------------------------------------- | ----------- |
| error       | `` | the HttpErrorResponse or the error thrown by the service     |
| requestData | `` | the HTTP request information such as the method and the url. |
