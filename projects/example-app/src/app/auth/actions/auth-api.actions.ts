import { Action } from '@ngrx/store';
import { User, Authenticate } from '../models/user';

export enum AuthApiActionTypes {
  Logout = '[Auth/API] Logout',
  LoginSuccess = '[Auth/API] Login Success',
  LoginFailure = '[Auth/API] Login Failure',
  LoginRedirect = '[Auth/API] Login Redirect',
}

export class LoginSuccess implements Action {
  readonly type = AuthApiActionTypes.LoginSuccess;

  constructor(public payload: { user: User }) {}
}

export class LoginFailure implements Action {
  readonly type = AuthApiActionTypes.LoginFailure;

  constructor(public payload: { error: any }) {}
}

export class LoginRedirect implements Action {
  readonly type = AuthApiActionTypes.LoginRedirect;
}

export class Logout implements Action {
  readonly type = AuthApiActionTypes.Logout;
}

export type AuthApiActionsUnion =
  | LoginSuccess
  | LoginFailure
  | LoginRedirect
  | Logout;
