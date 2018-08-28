import { Action } from '@ngrx/store';

export enum AuthActionTypes {
  Logout = '[Auth] Logout',
  LogoutConfirmation = '[Auth] Logout Confirmation',
  LogoutConfirmationDismiss = '[Auth] Logout Confirmation Dismiss',
}

export class Logout implements Action {
  readonly type = AuthActionTypes.Logout;
}

export class LogoutConfirmation implements Action {
  readonly type = AuthActionTypes.LogoutConfirmation;
}

export class LogoutConfirmationDismiss implements Action {
  readonly type = AuthActionTypes.LogoutConfirmationDismiss;
}

export type AuthActionsUnion =
  | Logout
  | LogoutConfirmation
  | LogoutConfirmationDismiss;
