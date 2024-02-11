import { authApiActions } from '@example-app/auth/actions/auth-api.actions';
import { loginPageActions } from '@example-app/auth/actions/login-page.actions';
import { createReducer, on } from '@ngrx/store';

export const loginPageFeatureKey = 'loginPage';

export interface State {
  error: string | null;
  pending: boolean;
}

export const initialState: State = {
  error: null,
  pending: false,
};

export const reducer = createReducer(
  initialState,
  on(loginPageActions.login, (state) => ({
    ...state,
    error: null,
    pending: true,
  })),

  on(authApiActions.loginSuccess, (state) => ({
    ...state,
    error: null,
    pending: false,
  })),
  on(authApiActions.loginFailure, (state, { error }) => ({
    ...state,
    error,
    pending: false,
  }))
);

export const getError = (state: State) => state.error;
export const getPending = (state: State) => state.pending;
