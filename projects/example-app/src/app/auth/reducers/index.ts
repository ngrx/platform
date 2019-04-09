import {
  createSelector,
  createFeatureSelector,
  Action,
  combineReducers,
} from '@ngrx/store';
import * as fromRoot from '@example-app/reducers';
import * as fromAuth from '@example-app/auth/reducers/auth.reducer';
import * as fromLoginPage from '@example-app/auth/reducers/login-page.reducer';

export interface AuthState {
  status: fromAuth.State;
  loginPage: fromLoginPage.State;
}

export interface State extends fromRoot.State {
  auth: AuthState;
}

export function reducers(state: AuthState | undefined, action: Action) {
  return combineReducers({
    status: fromAuth.reducer,
    loginPage: fromLoginPage.reducer,
  })(state, action);
}

export const selectAuthState = createFeatureSelector<State, AuthState>('auth');

export const selectAuthStatusState = createSelector(
  selectAuthState,
  (state: AuthState) => state.status
);
export const getUser = createSelector(selectAuthStatusState, fromAuth.getUser);
export const getLoggedIn = createSelector(getUser, user => !!user);

export const selectLoginPageState = createSelector(
  selectAuthState,
  (state: AuthState) => state.loginPage
);
export const getLoginPageError = createSelector(
  selectLoginPageState,
  fromLoginPage.getError
);
export const getLoginPagePending = createSelector(
  selectLoginPageState,
  fromLoginPage.getPending
);
