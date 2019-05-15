# Effects operators

As part of the `Effects` library, NgRx provides some useful operators that are frequently
used. 


## `ofType`

The `ofType` operator filters the stream of actions based on either string
values (that represent `type`s of actions) or Action Creators.

The generic for the `Actions<TypeUnion>` must be provided in order for type 
inference to work properly with string values. Action Creators that are based on
`createAction` function do not have the same limitation.

The `ofType` operator takes up to 5 arguments with proper type inference. It can
take even more, however the type would be inferred as an `Action` interface.

<code-example header="auth.effects.ts">
import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
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
      // Filters by Action Creator 'login'
      ofType(LoginPageActions.login),
      exhaustMap(action =>
        this.authService.login(action.credentials).pipe(
          map(user => AuthApiActions.loginSuccess({ user })),
          catchError(error => of(AuthApiActions.loginFailure({ error })))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private authService: AuthService
  ) {}
}
</code-example>

## `mapToAction`

Many effects are used to call APIs and due to the nature of network communication 
some of them may fail. That means that the service call should ideally be wrapped
with `catchError` to transform the failed request into another Action.

Not only `catchError` is necessary, it's has to be used before the stream is 
flattened or has to be constructed to re-subscribe to the source Observable.
Missing such error handling results in bugs that are hard to discover.

Even people who are familiar with these mistakes still make them sometimes.

The `mapToAction` operator wraps the `project` function that should return the main
"happy path" Observable that emits Action(s). It also requires an `error` callback
to be provided, so that steam can be flattened safely.

<code-example header="auth.effects.ts">
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
    )
  );

  constructor(
    private actions$: Actions,
    private authService: AuthService
  ) {}
}
</code-example>

Notice that it is no longer necessary to wrap the Error Action with the static `of`
Observable.

### `mapToAction` signatures
The `mapToAction` function has two signatures. The simple one takes two callbacks.

<code-example header="mapToAction with two callbacks">
function mapToAction<
  Input,
  OutputAction extends Action,
  ErrorAction extends Action
>(
  project: (input: Input, index: number) => Observable&#60;OutputAction&#62;,
  error: (error: any, input: Input) => ErrorAction
): (source: Observable&#60;Input&#62;) => Observable&#60;OutputAction | ErrorAction&#62;;
</code-example>

- `project`: A callback that is provided with an input value (often an Action) and 
expects the output result that is wrapped with Action
- `error`: A callback that is called if `project` throws an error

`mapToAction` uses the `concatMap` flattening strategy by default. When a more 
configurable option is needed or for more advanced use cases you can provide 
the config object.

<code-example header="mapToAction with config">

/** Represents the config with named parameters for mapToAction */
export interface MapToActionConfig<
  Input,
  OutputAction extends Action,
  ErrorAction extends Action,
  CompleteAction extends Action,
  UnsubscribeAction extends Action
> {
  project: (input: Input, index: number) => Observable&#60;OutputAction&#62;;
  error: (error: any, input: Input) => ErrorAction;
  complete?: (count: number, input: Input) => CompleteAction;
  operator?: &#60;Input, OutputAction&#62;(
    project: (input: Input, index: number) => Observable&#60;OutputAction&#62;
  ) => OperatorFunction&#60;Input, OutputAction&#62;;
  unsubscribe?: (count: number, input: Input) => UnsubscribeAction;
}

function mapToAction<
  Input,
  OutputAction extends Action,
  ErrorAction extends Action,
  CompleteAction extends Action = never,
  UnsubscribeAction extends Action = never
>(
  config: MapToActionConfig<
    Input,
    OutputAction,
    ErrorAction,
    CompleteAction,
    UnsubscribeAction
  >
): (
  source: Observable&#60;Input&#62;
) => Observable&#60;
  OutputAction | ErrorAction | CompleteAction | UnsubscribeAction
&#62;;
</code-example>

- `project`: A callback that is provided with an input value (often an Action) and 
expects the output result that is wrapped with Action
- `error`: A callback that is called if `project` throws an error
- `complete`: Optional complete action provider, when `project` completes
- `operator`: Optional flattening operator. `concatMap` is used by default
- `unsubscribe`: Optional unsubscribe action provider, when `project` is unsubscribed 
(e.g. in case of the `switchMap` flattening operator when a new value arrives)

