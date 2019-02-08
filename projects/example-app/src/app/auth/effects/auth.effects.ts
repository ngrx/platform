import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { Actions, ofType, effect } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, exhaustMap, map, tap } from 'rxjs/operators';
import {
  LoginPageActions,
  AuthActions,
  AuthApiActions,
} from '@example-app/auth/actions';
import { Credentials } from '@example-app/auth/models/user';
import { AuthService } from '@example-app/auth/services/auth.service';
import { LogoutConfirmationDialogComponent } from '@example-app/auth/components/logout-confirmation-dialog.component';

@Injectable()
export class AuthEffects {
  login$ = effect(() =>
    this.actions$.pipe(
      ofType(LoginPageActions.LoginPageActionTypes.Login),
      map(action => action.payload.credentials),
      exhaustMap((auth: Credentials) =>
        this.authService.login(auth).pipe(
          map(user => new AuthApiActions.LoginSuccess({ user })),
          catchError(error => of(new AuthApiActions.LoginFailure({ error })))
        )
      )
    )
  );

  loginSuccess$ = effect(
    () =>
      this.actions$.pipe(
        ofType(AuthApiActions.AuthApiActionTypes.LoginSuccess),
        tap(() => this.router.navigate(['/']))
      ),
    { dispatch: false }
  );

  loginRedirect$ = effect(
    () =>
      this.actions$.pipe(
        ofType(
          AuthApiActions.AuthApiActionTypes.LoginRedirect,
          AuthActions.AuthActionTypes.Logout
        ),
        tap(authed => {
          this.router.navigate(['/login']);
        })
      ),
    { dispatch: false }
  );

  logoutConfirmation$ = effect(() =>
    this.actions$.pipe(
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
    )
  );

  constructor(
    private actions$: Actions<LoginPageActions.LoginPageActionsUnion>,
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog
  ) {}
}
