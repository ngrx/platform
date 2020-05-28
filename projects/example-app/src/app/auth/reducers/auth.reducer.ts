import { createReducer, on } from '@ngrx/store';
import { AuthApiActions, AuthActions } from '@example-app/auth/actions';
import { User } from '@example-app/auth/models';

export const statusFeatureKey = 'status';

export interface State {
  user: User | null;
}

export const initialState: State = {
  user: null,
};

export const reducer = createReducer(
  initialState,
  on(AuthApiActions.loginSuccess, (state, { user }) => ({ ...state, user })),
  on(AuthActions.logout, () => initialState)
);

export const getUser = (state: State) => state.user;
