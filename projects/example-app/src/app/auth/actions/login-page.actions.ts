import { ActionsUnion, createAction } from '@ngrx/store';
import { Credentials } from '@example-app/auth/models/user';

export enum LoginPageActionTypes {
  Login = '[Login Page] Login',
}

export const LoginPageActions = {
  login: (credentials: Credentials) =>
    createAction(LoginPageActionTypes.Login, { credentials }),
};

export type LoginPageActions = ActionsUnion<typeof LoginPageActions>;
