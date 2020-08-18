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
