import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, exhaustMap, map, tap } from 'rxjs/operators';

import * as LoginPageActions from '../actions/login-page.actions';
import * as AuthActions from '../actions/auth.actions';

import {
  AuthApiActionTypes,
  LoginFailure,
  LoginSuccess,
} from '../actions/auth-api.actions';
import { Credentials } from '../models/user';
import { AuthService } from '../services/auth.service';
import { LogoutConfirmationDialogComponent } from '../components/logout-confirmation-dialog.component';

@Injectable()
export class AuthEffects {
  @Effect()
  login$ = this.actions$.pipe(
    ofType<LoginPageActions.Login>(LoginPageActions.LoginPageActionTypes.Login),
    map(action => action.payload.credentials),
    exhaustMap((auth: Credentials) =>
      this.authService.login(auth).pipe(
        map(user => new LoginSuccess({ user })),
        catchError(error => of(new LoginFailure({ error })))
      )
    )
  );

  @Effect({ dispatch: false })
  loginSuccess$ = this.actions$.pipe(
    ofType(AuthApiActionTypes.LoginSuccess),
    tap(() => this.router.navigate(['/']))
  );

  @Effect({ dispatch: false })
  loginRedirect$ = this.actions$.pipe(
    ofType(
      AuthApiActionTypes.LoginRedirect,
      AuthActions.AuthActionTypes.Logout
    ),
    tap(authed => {
      this.router.navigate(['/login']);
    })
  );

  @Effect()
  logoutConfirmation$ = this.actions$.pipe(
    ofType(AuthActions.AuthActionTypes.LogoutConfirmation),
    exhaustMap(() => {
      const dialogRef = this.dialog.open<
        LogoutConfirmationDialogComponent,
        undefined,
        boolean
      >(LogoutConfirmationDialogComponent);

      return dialogRef.afterClosed();
    }),
    map(
      result =>
        result
          ? new AuthActions.Logout()
          : new AuthActions.LogoutConfirmationDismiss()
    )
  );

  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog
  ) {}
}
