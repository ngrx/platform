import { createReducer, on } from '@ngrx/store';
import { AuthActions } from '../actions';

export interface State {
  loggedIn: boolean;
}

export const initialState: State = {
  loggedIn: false,
};

export const reducer = createReducer<State>(
  initialState,
  on(AuthActions.login, (): State => ({ loggedIn: true })),
  on(AuthActions.logout, (): State => ({ loggedIn: false }))
);

export const getLoggedIn = (state: State) => state.loggedIn;
