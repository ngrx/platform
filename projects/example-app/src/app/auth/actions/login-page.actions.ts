import { Action } from '@ngrx/store';
import { User, Authenticate } from '../models/user';

export enum LoginPageActionTypes {
  Login = '[Login Page] Login',
  LoginFailure = '[Login Page] Login - Failure',
  LoginSuccess = '[Login Page] Login - Success',
}

export class Login implements Action {
  readonly type = LoginPageActionTypes.Login;

  constructor(readonly payload: { credentials: Authenticate }) {}
}

export class LoginFailure implements Action {
  readonly type = LoginPageActionTypes.LoginFailure;

  constructor(readonly payload: { error: any }) {}
}

export class LoginSuccess implements Action {
  readonly type = LoginPageActionTypes.LoginSuccess;

  constructor(readonly payload: { user: User }) {}
}

export type LoginPageActionsUnion = Login | LoginFailure | LoginSuccess;
