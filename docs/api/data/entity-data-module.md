---
kind: ClassDeclaration
name: EntityDataModule
module: data
---

# EntityDataModule

## description

entity-data main module includes effects and HTTP data services
Configure with `forRoot`.
No `forFeature` yet.

```ts
class EntityDataModule {
  static forRoot(
    config: EntityDataModuleConfig
  ): ModuleWithProviders<EntityDataModule>;
  addEffects(effectSourceInstance: any);
}
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/entity-data.module.ts#L41-L122)

## Methods

### forRoot

```ts
static forRoot(  config: EntityDataModuleConfig ): ModuleWithProviders<EntityDataModule>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/entity-data.module.ts#L61-L95)

#### Parameters (#forRoot-parameters)

| Name   | Type                     | Description |
| ------ | ------------------------ | ----------- |
| config | `EntityDataModuleConfig` |             |

### addEffects

#### description (#addEffects-description)

Add another class instance that contains effects.

```ts
addEffects(effectSourceInstance: any);
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/entity-data.module.ts#L119-L121)

#### Parameters (#addEffects-parameters)

| Name                 | Type  | Description                               |
| -------------------- | ----- | ----------------------------------------- |
| effectSourceInstance | `any` | a class instance that implements effects. |
