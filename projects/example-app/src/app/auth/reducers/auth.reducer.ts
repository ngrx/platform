import {
  AuthApiActionsUnion,
  AuthApiActionTypes,
} from '@example-app/auth/actions/auth-api.actions';
import * as AuthActions from '@example-app/auth/actions/auth.actions';
import { User } from '@example-app/auth/models/user';

export interface State {
  user: User | null;
}

export const initialState: State = {
  user: null,
};

export function reducer(
  state = initialState,
  action: AuthApiActionsUnion | AuthActions.AuthActionsUnion
): State {
  switch (action.type) {
    case AuthApiActionTypes.LoginSuccess: {
      return {
        ...state,
        user: action.payload.user,
      };
    }

    case AuthActions.AuthActionTypes.Logout: {
      return initialState;
    }

    default: {
      return state;
    }
  }
}

export const getUser = (state: State) => state.user;
