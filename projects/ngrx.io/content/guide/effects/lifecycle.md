# Lifecycle

### ROOT_EFFECTS_INIT

After all the root effects have been added, the root effect dispatches a `ROOT_EFFECTS_INIT` action.
You can see this action as a lifecycle hook, which you can use in order to execute some code after all your root effects have been added.

<code-example header="init.effects.ts">
init$ = createEffect(() => 
  this.actions$.pipe(
    ofType(ROOT_EFFECTS_INIT),
    map(action => ...)
  )
);
</code-example>

## Effect Metadata

### Non-dispatching Effects

Sometimes you don't want effects to dispatch an action, for example when you only want to log or navigate based on an incoming action. But when an effect does not dispatch another action, the browser will crash because the effect is both 'subscribing' to and 'dispatching' the exact same action, causing an infinite loop. To prevent this, add `{ dispatch: false }` to the `createEffect` function as the second argument.

Usage:

<code-example header="log.effects.ts">
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';

@Injectable()
export class LogEffects {
  constructor(private actions$: Actions) {}
  
  logActions$ = createEffect(() =>
    this.actions$.pipe(
      tap(action => console.log(action))
    ), { dispatch: false });
}
</code-example>

### Resubscribe on Error

Starting with version 8, when an error happens in the effect's main stream it is
reported using Angular's `ErrorHandler`, and the source effect is 
**automatically** resubscribed to (instead of completing), so it continues to 
listen to all dispatched Actions.

Generally, errors should be handled by users, and operators such as `mapToAction`
should make it easier to do. However, for the cases where errors were missed, 
this new behavior adds an additional safety net.

In some cases where particular RxJS operators are used, the new behavior might
produce unexpected results. For example, if the `startWith` operator is within the
effect's pipe then it will be triggered again.

To disable resubscriptions add `{resubscribeOnError: false}` to the `createEffect` 
metadata (second argument).

<code-example header="disable-resubscribe.effects.ts">
import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect, mapToAction } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, exhaustMap, map } from 'rxjs/operators';
import {
  LoginPageActions,
  AuthApiActions,
} from '../actions';
import { Credentials } from '../models/user';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthEffects {
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LoginPageActions.login),
      mapToAction(
        // Happy path callback
        action => this.authService.login(action.credentials).pipe(
            map(user => AuthApiActions.loginSuccess({ user }))),
        // error callback
        error => AuthApiActions.loginFailure({ error }),
      )
    // Errors are handled and it is safe to disable resubscription 
    ), {resubscribeOnError: false });

  constructor(
    private actions$: Actions,
    private authService: AuthService
  ) {}
}
</code-example>

## Controlling Effects

### OnInitEffects

Implement this interface to dispatch a custom action after the effect has been added.
You can listen to this action in the rest of the application to execute something after the effect is registered.

Usage:

<code-example header="user.effects.ts">
class UserEffects implements OnInitEffects {
  ngrxOnInitEffects(): Action {
    return { type: '[UserEffects]: Init' };
  }
}
</code-example>

### OnRunEffects

By default, effects are merged and subscribed to the store. Implement the `OnRunEffects` interface to control the lifecycle of the resolved effects.

Usage:

<code-example header="user.effects.ts">
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

  updateUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType('UPDATE_USER'),
      tap(action => {
        console.log(action);
      })
    ),
  { dispatch: false });

  ngrxOnRunEffects(resolvedEffects$: Observable&lt;EffectNotification&gt;) {
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
</code-example>

### Identify Effects Uniquely

By default, each Effects class is registered once regardless of how many times the Effect class is loaded.
By implementing this interface, you define a unique identifier to register an Effects class instance multiple times.

Usage:

<code-example header="user.effects.ts">
class EffectWithIdentifier implements OnIdentifyEffects {
  constructor(private effectIdentifier: string) {}

  ngrxOnIdentifyEffects() {
    return this.effectIdentifier;
  }
}
</code-example>
