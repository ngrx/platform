---
kind: FunctionDeclaration
name: defaultEffectsErrorHandler
module: effects
---

# defaultEffectsErrorHandler

```ts
function defaultEffectsErrorHandler<T extends Action>(
  observable$: Observable<T>,
  errorHandler: ErrorHandler,
  retryAttemptLeft: number = MAX_NUMBER_OF_RETRY_ATTEMPTS
): Observable<T>;
```

## Parameters

| Name             | Type            | Description |
| ---------------- | --------------- | ----------- |
| observable\$     | `Observable<T>` |             |
| errorHandler     | `ErrorHandler`  |             |
| retryAttemptLeft | `number`        |             |
