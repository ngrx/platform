---
kind: InterfaceDeclaration
name: OnRunEffects
module: effects
---

# OnRunEffects

## description

Interface to control the lifecycle of effects.

By default, effects are merged and subscribed to the store. Implement the OnRunEffects interface to control the lifecycle of the resolved effects.

```ts
interface OnRunEffects {}
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/effects/src/lifecycle_hooks.ts#L73-L81)

## usageNotes

### Implement the OnRunEffects interface on an Effects class

```ts
export class UserEffects implements OnRunEffects {
  constructor(private actions$: Actions) {}

  ngrxOnRunEffects(resolvedEffects$: Observable<EffectNotification>) {
    return this.actions$.pipe(
      ofType('LOGGED_IN'),
      exhaustMap(() =>
        resolvedEffects$.pipe(
          takeUntil(this.actions$.pipe(ofType('LOGGED_OUT')))
        )
      )
    );
  }
}
```
