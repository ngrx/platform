import {
  createSelector,
  createFeatureSelector,
  Action,
  combineReducers,
} from '@ngrx/store';
import * as fromAuth from './auth.reducer';

export interface AuthState {
  status: fromAuth.State;
}

export interface State {
  auth: AuthState;
}

export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectAuthStatusState = createSelector(
  selectAuthState,
  (state: AuthState) => state.status
);

export const getLoggedIn = createSelector(
  selectAuthStatusState,
  fromAuth.getLoggedIn
);
