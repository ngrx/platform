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

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/effects/src/effects_resolver.ts#L11-L54)

## Parameters

| Name                | Type                  | Description |
| ------------------- | --------------------- | ----------- |
| sourceInstance      | `any`                 |             |
| globalErrorHandler  | `ErrorHandler`        |             |
| effectsErrorHandler | `EffectsErrorHandler` |             |
