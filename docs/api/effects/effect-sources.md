---
kind: ClassDeclaration
name: EffectSources
module: effects
---

# EffectSources

```ts
class EffectSources extends Subject<any> {
  addEffects(effectSourceInstance: any): void;
  toActions(): Observable<Action>;
}
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/effects/src/effect_sources.ts#L32-L86)

## Methods

### addEffects

```ts
addEffects(effectSourceInstance: any): void;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/effects/src/effect_sources.ts#L42-L44)

#### Parameters (#addEffects-parameters)

| Name                 | Type  | Description |
| -------------------- | ----- | ----------- |
| effectSourceInstance | `any` |             |

### toActions

```ts
toActions(): Observable<Action>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/effects/src/effect_sources.ts#L49-L85)

#### internal (#toActions-internal)
