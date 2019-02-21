import {
  AuthActions,
  AuthActionTypes,
  AuthApiActions,
  AuthApiActionTypes,
} from '@example-app/auth/actions';
import { User } from '@example-app/auth/models/user';

export interface State {
  user: User | null;
}

export const initialState: State = {
  user: null,
};

export function reducer(
  state = initialState,
  action: AuthApiActions | AuthActions
): State {
  switch (action.type) {
    case AuthApiActionTypes.LoginSuccess: {
      return {
        ...state,
        user: action.user,
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
