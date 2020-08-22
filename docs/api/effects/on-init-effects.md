---
kind: InterfaceDeclaration
name: OnInitEffects
module: effects
---

# OnInitEffects

## description

Interface to dispatch an action after effect registration.

Implement this interface to dispatch a custom action after
the effect has been added. You can listen to this action
in the rest of the application to execute something after
the effect is registered.

```ts
interface OnInitEffects {}
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/effects/src/lifecycle_hooks.ts#L109-L115)

## usageNotes

### Set an identifier for an Effects class

```ts
class EffectWithInitAction implements OnInitEffects {
ngrxOnInitEffects() {
return { type: '[EffectWithInitAction] Init' };
}
```
