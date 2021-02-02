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

## `concatLatestFrom`

The `concatLatestFrom` operator functions similarly to `withLatestFrom` with one important difference-
it lazily evaluates the provided Observable factory.

This allows you to utilize the source value when selecting additional sources to concat.

Additionally, because the factory is not executed until it is needed, it also mitigates the performance impact of creating some kinds of Observables.

For example, when selecting data from the store with `store.select`, `concatLatestFrom` will prevent the
selector from being evaluated until the source emits a value.

The `concatLatestFrom` operator takes an Observable factory function that returns an array of Observables, or a single Observable.

<code-example header="router.effects.ts">
import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { map, tap } from 'rxjs/operators';

import {Actions, concatLatestFrom, createEffect, ofType} from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { routerNavigatedAction } from '@ngrx/router-store';

import * as fromRoot from '@example-app/reducers';

@Injectable()
export class RouterEffects {
  updateTitle$ = createEffect(() =>
    this.actions$.pipe(
      ofType(routerNavigatedAction),
      concatLatestFrom(() => this.store.select(fromRoot.selectRouteData)),
      map(([, data]) => `Book Collection - ${data['title']}`),
      tap((title) => this.titleService.setTitle(title))
    ),
    {
      dispatch: false,
    }
  );

  constructor(
    private actions$: Actions,
    private store: Store<fromRoot.State>,
    private titleService: Title
  ) {}
}
</code-example>
