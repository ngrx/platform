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

<ngrx-code-example header="auth.effects.ts">

```ts
import { Injectable, inject } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, exhaustMap, map } from 'rxjs/operators';
import { LoginPageActions, AuthApiActions } from '../actions';
import { Credentials } from '../models/user';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private authService = inject(AuthService);

  login$ = createEffect(() => {
    return this.actions$.pipe(
      // Filters by Action Creator 'login'
      ofType(LoginPageActions.login),
      exhaustMap((action) =>
        this.authService.login(action.credentials).pipe(
          map((user) => AuthApiActions.loginSuccess({ user })),
          catchError((error) =>
            of(AuthApiActions.loginFailure({ error }))
          )
        )
      )
    );
  });
}
```

</ngrx-code-example>
