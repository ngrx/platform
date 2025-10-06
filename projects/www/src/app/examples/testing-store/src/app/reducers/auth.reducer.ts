import { createReducer, on } from '@ngrx/store';
import { AuthActions } from '../actions';

export interface State {
  username: string;
}

export const initialState: State = {
  username: '',
};

export const reducer = createReducer<State>(
  initialState,
  on(AuthActions.login, ({ username }): State => ({ username })),
  on(AuthActions.logout, (): State => ({ username: initialState.username }))
);

export const getUsername = (state: State) => state.username;
