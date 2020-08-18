---
kind: InterfaceDeclaration
name: EffectNotification
module: effects
---

# EffectNotification

```ts
interface EffectNotification {
  effect: Observable<any> | (() => Observable<any>);
  propertyName: PropertyKey;
  sourceName: string;
  sourceInstance: any;
  notification: Notification<Action | null | undefined>;
}
```
