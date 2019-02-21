import { Action, ActionsUnion, createAction } from '@ngrx/store';

export enum AuthActionTypes {
  Logout = '[Auth] Logout',
  LogoutConfirmation = '[Auth] Logout Confirmation',
  LogoutConfirmationDismiss = '[Auth] Logout Confirmation Dismiss',
}

export const AuthActions = {
  logout: () => createAction(AuthActionTypes.Logout),
  logoutConfirmation: () => createAction(AuthActionTypes.LogoutConfirmation),
  logoutConfirmationDismiss: () =>
    createAction(AuthActionTypes.LogoutConfirmationDismiss),
};

export type AuthActions = ActionsUnion<typeof AuthActions>;
