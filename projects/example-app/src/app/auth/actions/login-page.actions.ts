import { Action } from '@ngrx/store';
import { User, Authenticate } from '../models/user';

export enum LoginPageActionTypes {
  Login = '[Login Page] Login',
}

export class Login implements Action {
  readonly type = LoginPageActionTypes.Login;

  constructor(readonly payload: { credentials: Authenticate }) {}
}

export type LoginPageActionsUnion = Login;
