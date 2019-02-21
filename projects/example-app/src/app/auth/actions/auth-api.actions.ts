import { ActionsUnion, createAction } from '@ngrx/store';
import { User } from '@example-app/auth/models/user';

export enum AuthApiActionTypes {
  LoginSuccess = '[Auth/API] Login Success',
  LoginFailure = '[Auth/API] Login Failure',
  LoginRedirect = '[Auth/API] Login Redirect',
}

export const AuthApiActions = {
  loginRedirect: () => createAction(AuthApiActionTypes.LoginRedirect),
  loginSuccess: (user: User) =>
    createAction(AuthApiActionTypes.LoginSuccess, { user }),
  loginFailure: (error: any) =>
    createAction(AuthApiActionTypes.LoginFailure, { error }),
};

export type AuthApiActions = ActionsUnion<typeof AuthApiActions>;
