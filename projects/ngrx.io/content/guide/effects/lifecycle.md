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
import { Actions, createEffect } from '@ngrx/effects';
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
listen to all dispatched Actions. By default, effects are resubscribed up to 10
errors.

Generally, errors should be handled by users. However, for the cases where errors were missed,
this new behavior adds an additional safety net.

In some cases where particular RxJS operators are used, the new behavior might
produce unexpected results. For example, if the `startWith` operator is within the
effect's pipe then it will be triggered again.

To disable resubscriptions add `{useEffectsErrorHandler: false}` to the `createEffect`
metadata (second argument).

<code-example header="disable-resubscribe.effects.ts">
import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, exhaustMap, map } from 'rxjs/operators';
import {
  LoginPageActions,
  AuthApiActions,
} from '../actions';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthEffects {
  logins$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(LoginPageActions.login),
        exhaustMap(action =>
          this.authService.login(action.credentials).pipe(
            map(user => AuthApiActions.loginSuccess({ user })),
            catchError(error => of(AuthApiActions.loginFailure({ error })))
          )
        )
        // Errors are handled and it is safe to disable resubscription
      ),
    { useEffectsErrorHandler: false }
  );

  constructor(
    private actions$: Actions,
    private authService: AuthService
  ) {}
}
</code-example>

### Customizing the Effects Error Handler

The behavior of the default resubscription handler can be customized 
by providing a custom handler using the `EFFECTS_ERROR_HANDLER` injection token.

This allows you to provide a custom behavior, such as only retrying on
certain "retryable" errors, or change the maximum number of retries (it's set to
10 by default).

<code-example header="customise-error-handler.effects.ts">
import { ErrorHandler, NgModule } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { retryWhen, mergeMap } from 'rxjs/operators';
import { Action } from '@ngrx/store';
import { EffectsModule, EFFECTS_ERROR_HANDLER } from '@ngrx/effects';
import { MovieEffects } from './effects/movie.effects';
import { CustomErrorHandler, isRetryable } from '../custom-error-handler';

export function effectResubscriptionHandler&gt;T extends Action&lt;(
  observable$: Observable&gt;T&lt;,
  errorHandler?: CustomErrorHandler
): Observable&gt;T&lt; {
  return observable$.pipe(
    retryWhen(errors =>
      errors.pipe(
        mergeMap(e => {
          if (isRetryable(e)) {
            return errorHandler.handleRetryableError(e);
          }

          errorHandler.handleError(e);
          return throwError(e);
        })
      )
    )
  );
}

@NgModule({
  imports: [EffectsModule.forRoot([MovieEffects])],
  providers: [
    {
      provide: EFFECTS_ERROR_HANDLER,
      useValue: effectResubscriptionHandler,
    },
    {
      provide: ErrorHandler, 
      useClass: CustomErrorHandler 
    }
  ],
})
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
import { Observable } from 'rxjs';
import { exhaustMap, takeUntil, tap } from 'rxjs/operators';
import {
  Actions,
  OnRunEffects,
  EffectNotification,
  ofType,
  createEffect,
} from '@ngrx/effects';

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
