import { createSelector, provideState } from '@ngrx/store';
import { statusFeature } from './auth.reducer';
import { loginPageFeature } from './login-page.reducer';
import { makeEnvironmentProviders } from '@angular/core';

export const provideAuth = () =>
  makeEnvironmentProviders([
    provideState(statusFeature),
    provideState(loginPageFeature),
  ]);

export const selectLoggedIn = createSelector(
  statusFeature.selectUser,
  (user) => !!user
);

export const selectLoginPageError = loginPageFeature.selectError;

export const selectLoginPagePending = loginPageFeature.selectPending;
