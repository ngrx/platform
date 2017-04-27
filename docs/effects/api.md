# API

## EffectsModule

Feature module for @ngrx/effects.

### run

Registers an effects class to run when the target module bootstraps.
Call once per each effect class you want to run.

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

Registers an effects class to run after root components bootstrap.
Must use in the root module. Useful if your effects class requires 
the a bootstrapped component.

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

Filter actions by action types.

Usage:

```ts
actions$.ofType('LOGIN', 'LOGOUT');
```


### Non-dispatching Effects
Pass `{ dispatch: false }` to the decorator to prevent dispatching.

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
Add instances of effect classes to the subscription.

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
