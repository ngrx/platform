---
kind: FunctionDeclaration
name: mergeEffects
module: effects
---

# mergeEffects

```ts
function mergeEffects(
  sourceInstance: any,
  globalErrorHandler: ErrorHandler,
  effectsErrorHandler: EffectsErrorHandler
): Observable<EffectNotification>;
```

## Parameters

| Name                | Type                  | Description |
| ------------------- | --------------------- | ----------- |
| sourceInstance      | `any`                 |             |
| globalErrorHandler  | `ErrorHandler`        |             |
| effectsErrorHandler | `EffectsErrorHandler` |             |
