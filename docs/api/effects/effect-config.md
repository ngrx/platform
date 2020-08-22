---
kind: InterfaceDeclaration
name: EffectConfig
module: effects
---

# EffectConfig

## description

Configures an effect created by `createEffect`.

```ts
interface EffectConfig {
  dispatch?: boolean;
  useEffectsErrorHandler?: boolean;
}
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/effects/src/models.ts#L4-L14)
