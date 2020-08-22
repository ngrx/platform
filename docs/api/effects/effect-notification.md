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

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/effects/src/effect_notification.ts#L5-L11)
