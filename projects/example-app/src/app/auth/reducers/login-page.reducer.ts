import { AuthApiActions } from '@example-app/auth/actions/auth-api.actions';
import { LoginPageActions } from '@example-app/auth/actions/login-page.actions';
import { createFeature, createReducer, on } from '@ngrx/store';

export interface State {
  error: string | null;
  pending: boolean;
}

export const initialState: State = {
  error: null,
  pending: false,
};

export const loginPageFeature = createFeature({
  name: 'authLoginPage',
  reducer: createReducer(
    initialState,
    on(LoginPageActions.login, (state) => ({
      ...state,
      error: null,
      pending: true,
    })),

    on(AuthApiActions.loginSuccess, (state) => ({
      ...state,
      error: null,
      pending: false,
    })),
    on(AuthApiActions.loginFailure, (state, { error }) => ({
      ...state,
      error,
      pending: false,
    }))
  ),
});
