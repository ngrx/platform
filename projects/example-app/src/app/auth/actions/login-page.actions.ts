import { Action } from '@ngrx/store';
import { Credentials } from '@example-app/auth/models/user';

export enum LoginPageActionTypes {
  Login = '[Login Page] Login',
}

export class Login implements Action {
  readonly type = LoginPageActionTypes.Login;

  constructor(public payload: { credentials: Credentials }) {}
}

export type LoginPageActionsUnion = Login;
