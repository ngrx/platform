import { AuthApiActions, LoginPageActions } from '@example-app/auth/actions';
import { createReducer, on } from '@ngrx/store';

export interface State {
  error: string | null;
  pending: boolean;
}

export const initialState: State = {
  error: null,
  pending: false,
};

export const reducer = createReducer<State>(
  [
    on(LoginPageActions.login, state => ({
      ...state,
      error: null,
      pending: true,
    })),

    on(AuthApiActions.loginSuccess, state => ({
      ...state,
      error: null,
      pending: false,
    })),
    on(AuthApiActions.loginFailure, (state, { error }) => ({
      ...state,
      error,
      pending: false,
    })),
  ],
  initialState
);

export const getError = (state: State) => state.error;
export const getPending = (state: State) => state.pending;
