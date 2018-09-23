import { LoginActionsUnion, LoginActionTypes } from '../actions/auth.actions';

export interface AuthState {
  loggedIn: boolean;
  errorMsg: string;
  user: object;
  isLogging: boolean;
}

export const initialState: AuthState = {
  loggedIn: false,
  errorMsg: null,
  user: null,
  isLogging: false,
};

export function reducer(
  state: AuthState = initialState,
  action: LoginActionsUnion
): AuthState {
  switch (action.type) {
    case LoginActionTypes.LOGIN:
      return {
        ...state,
        user: action.payload,
      };
    case LoginActionTypes.LOGIN_SUCCESS:
      return {
        ...state,
        loggedIn: true,
      };
    case LoginActionTypes.LOGIN_FAIL:
      return {
        ...state,
        errorMsg: 'Invalid user credential',
      };
    case LoginActionTypes.IS_LOGIN:
      return {
        ...state,
        isLogging: true,
      };
    case LoginActionTypes.LOGIN_DONE:
      return {
        ...state,
        isLogging: false,
      };
    default:
      return state;
  }
}

export const getLoginState = (state: AuthState) => state.loggedIn;
export const getLoginStatus = (state: AuthState) => state.errorMsg;
export const getIsLoginState = (state: AuthState) => state.isLogging;
