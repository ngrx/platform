import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/exhaustMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Effect, Actions } from '@ngrx/effects';
import { of } from 'rxjs/observable/of';

import { AuthService } from '../services/auth.service';
import {
  Login,
  LoginSuccess,
  LoginFailure,
  AuthActionTypes,
} from '../actions/auth';

@Injectable()
export class AuthEffects {
  @Effect()
  login$ = this.actions$
    .ofType(AuthActionTypes.Login)
    .map((action: Login) => action.payload)
    .exhaustMap(auth =>
      this.authService
        .login(auth)
        .map(user => new LoginSuccess({ user }))
        .catch(error => of(new LoginFailure(error)))
    );

  @Effect({ dispatch: false })
  loginSuccess$ = this.actions$
    .ofType(AuthActionTypes.LoginSuccess)
    .do(() => this.router.navigate(['/']));

  @Effect({ dispatch: false })
  loginRedirect$ = this.actions$
    .ofType(AuthActionTypes.LoginRedirect, AuthActionTypes.Logout)
    .do(authed => {
      this.router.navigate(['/login']);
    });

  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private router: Router
  ) {}
}
