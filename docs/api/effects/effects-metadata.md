---
kind: TypeAliasDeclaration
name: EffectsMetadata
module: effects
---

# EffectsMetadata

```ts
export type EffectsMetadata<T> = {
  [key in EffectPropertyKey<T>]?: EffectConfig;
};
```
