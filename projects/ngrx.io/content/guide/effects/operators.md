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
it lazily evaluates its input Observables. This mitigates the performance impact of creating some kinds of Observables.

For example, when selecting data from the store with `store.select`, `concatLatestFrom` will prevent the
selector from being evaluated until the previous operators in the pipe pass forward a value.

The `concatLatestFrom` operator takes a function that returns an array with up to 8 elements with proper type inference. It can
take even more, however the type would be inferred as an `Observable<unknown>[]`.

<code-example header="auth.effects.ts">
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { of } from 'rxjs';
import { tap, concatMap, withLatestFrom } from 'rxjs/operators';
import { CollectionApiActions } from '../actions';
import * as fromBooks from '../reducers';

@Injectable()
export class CollectionEffects {
  addBookToCollectionSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CollectionApiActions.addBookSuccess),
        // `getCollectionBookIds` will not be evaluated until an `addBookSuccess` action is received
        concatLatestFrom(action => this.store.select(fromBooks.getCollectionBookIds)
        tap(([action, bookCollection]) => {
          if (bookCollection.length === 1) {
            window.alert('Congrats on adding your first book!');
          } else {
            window.alert('You have added book number ' + bookCollection.length);
          }
        })
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private store: Store<fromBooks.State>
  ) {}
}
</code-example>
