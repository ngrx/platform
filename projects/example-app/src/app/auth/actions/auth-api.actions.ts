import { Action } from '@ngrx/store';
import { User, Credentials } from '../models/user';

export enum AuthApiActionTypes {
  Logout = '[Auth/API] Logout',
  LoginSuccess = '[Auth/API] Login Success',
  LoginFailure = '[Auth/API] Login Failure',
  LoginRedirect = '[Auth/API] Login Redirect',
  LogoutConfirmation = '[Auth/APi] Logout Confirmation',
  LogoutConfirmationDismiss = '[Auth/API] Logout Confirmation Dismiss',
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

export class LogoutConfirmation implements Action {
  readonly type = AuthApiActionTypes.LogoutConfirmation;
}

export class LogoutConfirmationDismiss implements Action {
  readonly type = AuthApiActionTypes.LogoutConfirmationDismiss;
}

export type AuthApiActionsUnion =
  | LoginSuccess
  | LoginFailure
  | LoginRedirect
  | Logout
  | LogoutConfirmation
  | LogoutConfirmationDismiss;
