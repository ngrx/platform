# Lifecycle

### ROOT_EFFECTS_INIT

After all the root effects have been added, the root effect dispatches a `ROOT_EFFECTS_INIT` action.
You can see this action as a lifecycle hook, which you can use in order to execute some code after all your root effects have been added.

```ts
@Effect()
init$ = this.actions$.pipe(
  ofType(ROOT_EFFECTS_INIT),
  map(action => ...)
);
```

### UPDATE_EFFECTS

After feature effects are registered, an `UPDATE_EFFECTS` action is dispatched.

```ts
type UpdateEffects = {
  type: typeof UPDATE_EFFECTS;
  effects: string[];
};
```

For example, when you register your feature module as `EffectsModule.forFeature([SomeEffectsClass, AnotherEffectsClass])`,
it has `SomeEffectsClass` and `AnotherEffectsClass` in an array as its payload.

To dispatch an action when the `SomeEffectsClass` effect has been registered, listen to the `UPDATE_EFFECTS` action and use the `effects` payload to filter out non-important effects.

```ts
@Effect()
init = this.actions.pipe(
  ofType<UpdateEffects>(UPDATE_EFFECTS)
  filter(action => action.effects.includes('SomeEffectsClass')),
  map(action => ...)
);
```

### Non-dispatching Effects

Pass `{ dispatch: false }` to the decorator to prevent dispatching.

Sometimes you don't want effects to dispatch an action, for example when you only want to log or navigate. But when an effect does not dispatch another action, the browser will crash because the effect is both 'subscribing' to and 'dispatching' the exact same action, causing an infinite loop. To prevent this, add { dispatch: false } to the decorator.

Usage:

```ts
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';

@Injectable()
export class SomeEffectsClass {
  constructor(private actions$: Actions) {}

  @Effect({ dispatch: false })
  logActions$ = this.actions$.pipe(tap(action => console.log(action)));
}
```

### Initializing effect

You can execute some code that will be executed directly after the effect class is loaded.

```ts
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { defer } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class SomeEffectsClass {
  constructor(private actions$: Actions) {}

  @Effect({ dispatch: false })
  init$: Observable<any> = defer(() => of(null)).pipe(
    tap(() => console.log('init$'))
  );
}
```

If you want to trigger another action, be careful to add this effect at the end.

```ts
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { defer } from 'rxjs';
import { LoginAction, LogoutAction } from './auth.actions';

@Injectable()
export class SomeEffectsClass {
  constructor(private actions$: Actions) {}

  @Effect({ dispatch: false })
  authActions$ = this.actions$.pipe(
    ofType<LoginAction | LogoutAction>('LOGIN', 'LOGOUT'),
    tap(action => console.log(action))
  );

  // Should be your last effect
  @Effect()
  init$: Observable<action> = defer(() => {
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
import {
  Actions,
  Effect,
  OnRunEffects,
  EffectNotification,
  ofType,
} from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs';
import { exhaustMap, takeUntil, tap } from 'rxjs/operators';

@Injectable()
export class UserEffects implements OnRunEffects {
  constructor(private actions$: Actions) {}

  @Effect()
  updateUser$: Observable<Action> = this.actions$.pipe(
    ofType('UPDATE_USER'),
    tap(action => {
      console.log(action);
    })
  );

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
