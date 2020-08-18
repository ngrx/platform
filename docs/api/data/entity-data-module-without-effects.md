---
kind: ClassDeclaration
name: EntityDataModuleWithoutEffects
module: data
---

# EntityDataModuleWithoutEffects

## description

Module without effects or dataservices which means no HTTP calls
This module helpful for internal testing.
Also helpful for apps that handle server access on their own and
therefore opt-out of @ngrx/effects for entities

```ts
class EntityDataModuleWithoutEffects implements OnDestroy {
  static forRoot(
    config: EntityDataModuleConfig
  ): ModuleWithProviders<EntityDataModuleWithoutEffects>;
  ngOnDestroy();
}
```
