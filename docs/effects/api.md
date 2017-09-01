# API

## EffectsModule

NgModule for @ngrx/effects.

### forRoot
Registers internal @ngrx/effects services to run in your application. This is required once in your root NgModule.

Usage:
```ts
@NgModule({
  imports: [
    EffectsModule.forRoot([
      FirstEffectsClass,
      SecondEffectsClass,
    ])
  ]
})
export class AppModule { }
```

### forFeature
Registers @ngrx/effects services to run with your feature modules.

**Note**: Running an effects class multiple times, either by `forRoot()` or `forFeature()`, (for example via different lazy loaded modules) will not cause Effects to run multiple times. There is no functional difference between effects loaded by `forRoot()` and `forFeature()`; the important difference between the functions is that `forRoot()` sets up the providers required for effects. 

Usage:
```ts
@NgModule({
  imports: [
    EffectsModule.forFeature([
      SomeEffectsClass,
      AnotherEffectsClass,
    ])
  ]
})
export class FeatureModule {}
```

## Actions

Stream of all actions dispatched in your application including actions dispatched by effect streams.

Usage:
```ts
import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';

@Injectable()
export class SomeEffectsClass {
  constructor(private actions$: Actions) {}
}
```

### ofType

Filter actions by action types. Specify the action type to allow type-safe mapping to other data on the action, including payload.

Usage:
```ts
import 'rxjs/add/operator/do';
import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';

@Injectable()
export class SomeEffectsClass {
  constructor(private actions$: Actions) {}

  @Effect() authActions$ = this.action$.ofType<LoginAction | LogoutAction>('LOGIN', 'LOGOUT')
    .do(action => {
      console.log(action);
    });
}
```

### Non-dispatching Effects
Pass `{ dispatch: false }` to the decorator to prevent dispatching.

Usage:
```ts
import 'rxjs/add/operator/do';
import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';

@Injectable()
export class SomeEffectsClass {
  constructor(private actions$: Actions) { }

  @Effect({ dispatch: false }) logActions$ = this.actions$
    .do(action => {
      console.log(action);
    });
}
```

## Controlling Effects

### OnRunEffects
By default, effects are merged and subscribed to the store. Implement the `OnRunEffects` interface to control the lifecycle of the resolved effects.

Usage:
```ts
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/exhaustMap';
import 'rxjs/add/operator/takeUntil';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Action } from '@ngrx/store';
import { Actions, Effect, OnRunEffects, EffectNotification } from '@ngrx/effects';

@Injectable()
export class UserEffects implements OnRunEffects {
  constructor(private actions$: Actions) {}

  @Effect() updateUser$: Observable<Action> = this.actions$
    .ofType('UPDATE_USER')
    .do(action => {
      console.log(action);
    });

  ngrxOnRunEffects(resolvedEffects$: Observable<EffectNotification>) {
    return this.actions$.ofType('LOGGED_IN')
      .exhaustMap(() => resolvedEffects$.takeUntil('LOGGED_OUT'));
  }
}
```

## Utilities

### toPayload (DEPRECATED)
Maps an action to its payload. This function is deprecated, and will be removed in version 5.0.

Usage:
```ts
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';
import { Actions, Effect, toPayload } from '@ngrx/effects';

@Injectable()
export class SomeEffectsClass {
  constructor(private actions$: Actions) {}

  @Effect() authActions$ = this.action$.ofType('LOGIN', 'LOGOUT')
    .map(toPayload)
    .do(payload => {
      console.log(payload);
    });
}
```

Recommended alternative to deprecated toPayload function. Note that the type
of the action is specified so that mapping to payload (or whatever data is available in the action) is type-safe.
```ts
  @Effect() authActions$ = this.action$.ofType<LoadingAction | LogoutAction>('LOGIN', 'LOGOUT')
    .map(action => action.payload)
    .do(payload => {
      console.log(payload);
```

### mergeEffects
Manually merges all decorated effects into a combined observable.

Usage:
```ts
import { mergeEffects } from '@ngrx/effects';

export class MyService {
  constructor(effects: SomeEffectsClass) {
    mergeEffects(effects).subscribe(result => {
      console.log(result);
    });
  }
}
```
