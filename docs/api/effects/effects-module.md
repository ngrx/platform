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

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/effects/src/effects_module.ts#L25-L90)

## Methods

### forFeature

```ts
static forFeature(  featureEffects: Type<any>[] = [] ): ModuleWithProviders<EffectsFeatureModule>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/effects/src/effects_module.ts#L27-L52)

#### Parameters (#forFeature-parameters)

| Name           | Type          | Description |
| -------------- | ------------- | ----------- |
| featureEffects | `Type<any>[]` |             |

### forRoot

```ts
static forRoot(  rootEffects: Type<any>[] = [] ): ModuleWithProviders<EffectsRootModule>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/effects/src/effects_module.ts#L54-L89)

#### Parameters (#forRoot-parameters)

| Name        | Type          | Description |
| ----------- | ------------- | ----------- |
| rootEffects | `Type<any>[]` |             |
