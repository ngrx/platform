import * as fromAuth from './reducers/auth.reducer';
import * as fromRoot from '@core/store/reducers/index';
import { AuthState } from './reducers/auth.reducer';
import { createFeatureSelector, createSelector } from '@ngrx/store';

export interface State extends fromRoot.State {
  auth: AuthState;
}

export const selectAuthState = createFeatureSelector<AuthState>('authModule');

export const selectAuthStatusState = createSelector(
  selectAuthState,
  fromAuth.getLoginState
);

export const selectLoginState = createSelector(
  selectAuthState,
  fromAuth.getLoginStatus
);

export const selectIsLoginState = createSelector(
  selectAuthState,
  fromAuth.getIsLoginState
);
