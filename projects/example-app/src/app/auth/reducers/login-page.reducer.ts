import {
  AuthApiActions,
  AuthApiActionTypes,
  LoginPageActions,
  LoginPageActionTypes,
} from '@example-app/auth/actions';

export interface State {
  error: string | null;
  pending: boolean;
}

export const initialState: State = {
  error: null,
  pending: false,
};

export function reducer(
  state = initialState,
  action: AuthApiActions | LoginPageActions
): State {
  switch (action.type) {
    case LoginPageActionTypes.Login: {
      return {
        ...state,
        error: null,
        pending: true,
      };
    }

    case AuthApiActionTypes.LoginSuccess: {
      return {
        ...state,
        error: null,
        pending: false,
      };
    }

    case AuthApiActionTypes.LoginFailure: {
      return {
        ...state,
        error: action.error,
        pending: false,
      };
    }

    default: {
      return state;
    }
  }
}

export const getError = (state: State) => state.error;
export const getPending = (state: State) => state.pending;
