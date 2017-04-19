# API

## EffectsModule

Feature module for @ngrx/effects.

### run

Registers an effects class to be run immediately when the target module is
created. Must be called multiple times for each effect class you want to run.

Usage:
```ts
@NgModule({
  imports: [
    EffectsModule.run(SomeEffectsClass)
  ]
})
export class AppModule { }
```

### runAfterBootstrap

Registers an effects class to be run after root components are bootstrapped.
Only works in the root module. Useful if your effects class requires components
to be bootstrapped.

Usage:
```ts
@NgModule({
  imports: [
    EffectsModule.runAfterBootstrap(SomeEffectsClass)
  ]
})
```


## Actions

Stream of all actions dispatched in your application including actions
dispatched by effect streams.

### ofType

Filter actions by action type. Accepts multiple action types.

Usage:

```ts
actions$.ofType('LOGIN', 'LOGOUT');
```


### Non-dispatching Effects
Observables decorated with the `@Effect()` decorator are expected to be a stream
of actions to be dispatched. Pass `{ dispatch: false }` to the decorator to
prevent actions from being dispatched.

Usage:
```ts
class MyEffects {
  constructor(private actions$: Actions) { }

  @Effect({ dispatch: false }) logActions$ = this.actions$
    .do(action => {
      console.log(action);
    });
}
```

## Utilities

### toPayload
Maps an action to its payload.

Usage:
```ts
actions$.ofType('LOGIN').map(toPayload);
```

### mergeEffects
Manually merges all decorated effects into a combined observable.

Usage:
```ts
export class MyService {
  constructor(effects: SomeEffectsClass) {
    mergeEffects(effects).subscribe(result => {

    });
  }
}
```

## EffectsSubscription

An RxJS subscription of all effects running for the current injector. Can be
used to stop all running effects contained in the subscription.

Usage:
```ts
class MyComponent {
  constructor(private subscription: EffectsSubscription) { }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
```

### addEffects
Add additional instances of effect classes to the subscription.

Usage:
```ts
class MyComponent {
  constructor(moreEffects: MoreEffects, subscription: EffectsSubscription) {
    subscription.addEffects([ moreEffects ]);
  }
}
```

### parent
A pointer to the parent subscription. Used to access an entire tree of
subscriptions.

Usage:
```ts
subscription.parent.unsubscribe();
```
