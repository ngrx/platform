import { Action } from '@ngrx/store';

export enum AuthActionTypes {
    Login = '[Auth] Login',
    Logout = '[Auth] Logout'
}

export class Login implements Action {
  readonly type = AuthActionTypes.Login;
}

export class Logout implements Action {
  readonly type = AuthActionTypes.Logout;
}

export type AuthActions = Login | Logout;