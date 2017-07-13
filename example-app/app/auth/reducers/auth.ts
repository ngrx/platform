import * as auth from '../actions/auth';
import { User } from '../models/user';

export interface State {
  loggedIn: boolean;
  user: User | null;
}

export const initialState: State = {
  loggedIn: false,
  user: null,
};

export function reducer(state = initialState, action: auth.Actions): State {
  switch (action.type) {
    case auth.LOGIN_SUCCESS: {
      return {
        ...state,
        loggedIn: true,
        user: action.payload.user,
      };
    }

    case auth.LOGOUT: {
      return initialState;
    }

    default: {
      return state;
    }
  }
}

export const getLoggedIn = (state: State) => state.loggedIn;
export const getUser = (state: State) => state.user;
