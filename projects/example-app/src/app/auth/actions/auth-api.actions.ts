import { union, props, createAction } from '@ngrx/store';
import { User } from '@example-app/auth/models/user';

export const loginSuccess = createAction(
  '[Auth/API] Login Success',
  props<{ user: User }>()
);

export const loginFailure = createAction(
  '[Auth/API] Login Failure',
  props<{ error: any }>()
);

export const loginRedirect = createAction('[Auth/API] Login Redirect');

const all = union({ loginSuccess, loginFailure, loginRedirect });
export type AuthApiActionsUnion = typeof all;
