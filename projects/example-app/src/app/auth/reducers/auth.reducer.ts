import { createReducer, on } from '@ngrx/store';
import { AuthApiActions, AuthActions } from '@example-app/auth/actions';
import { User } from '@example-app/auth/models/user';

export interface State {
  user: User | null;
}

export const initialState: State = {
  user: null,
};

export const reducer = createReducer<State>(
  [
    on(AuthApiActions.loginSuccess, (state, { user }) => ({ ...state, user })),
    on(AuthActions.logout, () => initialState),
  ],
  initialState
);

export const getUser = (state: State) => state.user;
