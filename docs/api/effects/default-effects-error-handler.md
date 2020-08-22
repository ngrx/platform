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

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/effects/src/effects_error_handler.ts#L13-L32)

## Parameters

| Name             | Type            | Description |
| ---------------- | --------------- | ----------- |
| observable\$     | `Observable<T>` |             |
| errorHandler     | `ErrorHandler`  |             |
| retryAttemptLeft | `number`        |             |
