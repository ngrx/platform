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

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/effects/src/models.ts#L37-L39)
