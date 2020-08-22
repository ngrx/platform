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

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/entity-data-without-effects.module.ts#L71-L172)

## Methods

### forRoot

```ts
static forRoot(  config: EntityDataModuleConfig ): ModuleWithProviders<EntityDataModuleWithoutEffects>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/entity-data-without-effects.module.ts#L101-L126)

#### Parameters (#forRoot-parameters)

| Name   | Type                     | Description |
| ------ | ------------------------ | ----------- |
| config | `EntityDataModuleConfig` |             |

### ngOnDestroy

```ts
ngOnDestroy();
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/entity-data-without-effects.module.ts#L169-L171)
