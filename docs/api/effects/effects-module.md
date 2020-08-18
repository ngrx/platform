---
kind: ClassDeclaration
name: EffectsModule
module: effects
---

# EffectsModule

```ts
class EffectsModule {
  static forFeature(
    featureEffects: Type<any>[] = []
  ): ModuleWithProviders<EffectsFeatureModule>;
  static forRoot(
    rootEffects: Type<any>[] = []
  ): ModuleWithProviders<EffectsRootModule>;
}
```
