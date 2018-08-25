import { AuthActionsUnion, AuthActionTypes } from './../actions/auth.actions';
import { User } from '../models/user';

export interface State {
  user: User | null;
}

export const initialState: State = {
  user: null,
};

export function reducer(state = initialState, action: AuthActionsUnion): State {
  switch (action.type) {
    case AuthActionTypes.LoginSuccess: {
      return {
        ...state,
        user: action.payload.user,
      };
    }

    case AuthActionTypes.Logout: {
      return initialState;
    }

    default: {
      return state;
    }
  }
}

export const getUser = (state: State) => state.user;
