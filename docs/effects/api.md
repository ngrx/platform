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
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';

@Injectable()
export class SomeEffectsClass {
  constructor(private actions$: Actions) {}

  @Effect() authActions$ = this.actions$.pipe(
    ofType<LoginAction | LogoutAction>('LOGIN', 'LOGOUT'),
    tap(action => console.log(action))
  );
}
```

### Non-dispatching Effects
Pass `{ dispatch: false }` to the decorator to prevent dispatching.

Usage:
```ts
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';

@Injectable()
export class SomeEffectsClass {
  constructor(private actions$: Actions) { }

  @Effect({ dispatch: false }) logActions$ = this.actions$.pipe(
    tap(action => console.log(action))
  );
}
```

### Initializing effect
You can execute some code that will be executed directly after the effect class is loaded.
```ts
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { defer } from 'rxjs/observable/defer';
import { tap } from 'rxjs/operators';

@Injectable()
export class SomeEffectsClass {
  constructor(private actions$: Actions) { }

  @Effect({ dispatch: false }) init$: Observable<any> = defer(() => of(null)).pipe(
    tap(() => console.log('init$')),
  );
}
```

If you want to trigger another action, be careful to add this effect at the end.
```ts
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { defer } from 'rxjs/observable/defer';
import { LoginAction, LogoutAction } from './auth';

@Injectable()
export class SomeEffectsClass {
  constructor(private actions$: Actions) { }

  @Effect({ dispatch: false }) authActions$ = this.actions$.pipe(
    ofType<LoginAction | LogoutAction>('LOGIN', 'LOGOUT'),
      tap(action => console.log(action))
    );

  // Should be your last effect
  @Effect() init$: Observable<action> = defer(() => {
    return of(new LogoutAction());
  });
}
```

## Controlling Effects

### OnRunEffects
By default, effects are merged and subscribed to the store. Implement the `OnRunEffects` interface to control the lifecycle of the resolved effects.

Usage:
```ts
import { Injectable } from '@angular/core';
import { Actions, Effect, OnRunEffects, EffectNotification, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { exhaustMap, takeUntil, tap } from 'rxjs/operators';

@Injectable()
export class UserEffects implements OnRunEffects {
  constructor(private actions$: Actions) {}

  @Effect() updateUser$: Observable<Action> = this.actions$.pipe(
    ofType('UPDATE_USER'),
    tap(action => {
      console.log(action);
    })
  );

  ngrxOnRunEffects(resolvedEffects$: Observable<EffectNotification>) {
    return this.actions$.pipe(
      ofType('LOGGED_IN'),
      exhaustMap(() => resolvedEffects$.pipe(
        takeUntil(this.actions$.pipe(ofType('LOGGED_OUT')))
      )
    );
  }
}
```

## Utilities

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
