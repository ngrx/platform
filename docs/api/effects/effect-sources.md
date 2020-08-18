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
