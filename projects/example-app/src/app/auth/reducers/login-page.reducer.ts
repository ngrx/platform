import {
  LoginPageActionTypes,
  LoginPageActionsUnion,
} from './../actions/login-page.actions';

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
  action: LoginPageActionsUnion
): State {
  switch (action.type) {
    case LoginPageActionTypes.Login: {
      return {
        ...state,
        error: null,
        pending: true,
      };
    }

    case LoginPageActionTypes.LoginSuccess: {
      return {
        ...state,
        error: null,
        pending: false,
      };
    }

    case LoginPageActionTypes.LoginFailure: {
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
