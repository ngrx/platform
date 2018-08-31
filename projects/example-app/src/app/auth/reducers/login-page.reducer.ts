import { AuthApiActions, LoginPageActions } from '@example-app/auth/actions';

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
  action:
    | AuthApiActions.AuthApiActionsUnion
    | LoginPageActions.LoginPageActionsUnion
): State {
  switch (action.type) {
    case LoginPageActions.LoginPageActionTypes.Login: {
      return {
        ...state,
        error: null,
        pending: true,
      };
    }

    case AuthApiActions.AuthApiActionTypes.LoginSuccess: {
      return {
        ...state,
        error: null,
        pending: false,
      };
    }

    case AuthApiActions.AuthApiActionTypes.LoginFailure: {
      return {
        ...state,
        error: action.payload.error,
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
