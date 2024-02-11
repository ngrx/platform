import { createReducer, on } from '@ngrx/store';
import { authApiActions } from '@example-app/auth/actions/auth-api.actions';
import { authActions } from '@example-app/auth/actions/auth.actions';
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
  on(authApiActions.loginSuccess, (state, { user }) => ({ ...state, user })),
  on(authActions.logout, () => initialState)
);

export const getUser = (state: State) => state.user;
