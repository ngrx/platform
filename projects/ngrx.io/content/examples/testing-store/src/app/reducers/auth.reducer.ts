import { Action } from '@ngrx/store';
import { AuthActions, AuthActionTypes } from '../auth.actions';

export interface State {
  loggedIn: boolean;
}

export const initialState: State = {
  loggedIn: false,
};

export function reducer(
  state = initialState,
  action: AuthActions
): State {
  switch (action.type) {
    case AuthActionTypes.Login: {
      return {
        loggedIn: true
      };
    }
    case AuthActionTypes.Logout: {
      return {
        loggedIn: false
      };
    }
    default: {
      return state;
    }
  }
}

export const getLoggedIn = (state: State) => state.loggedIn;
