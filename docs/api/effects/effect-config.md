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
