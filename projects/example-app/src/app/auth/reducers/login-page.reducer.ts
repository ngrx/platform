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
    case LoginPageActions.login.type: {
      return {
        ...state,
        error: null,
        pending: true,
      };
    }

    case AuthApiActions.loginSuccess.type: {
      return {
        ...state,
        error: null,
        pending: false,
      };
    }

    case AuthApiActions.loginFailure.type: {
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
