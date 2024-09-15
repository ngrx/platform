import { createFeature, createReducer, on, provideState } from '@ngrx/store';

import { LayoutActions } from '@example-app/core/actions/layout.actions';
import { AuthActions } from '@example-app/auth/actions/auth.actions';
import { makeEnvironmentProviders } from '@angular/core';

export interface State {
  showSidenav: boolean;
}

const initialState: State = {
  showSidenav: false,
};

const layoutFeature = createFeature({
  name: 'layout',
  reducer: createReducer(
    initialState,
    on(LayoutActions.closeSidenav, () => ({ showSidenav: false })),
    on(LayoutActions.openSidenav, () => ({ showSidenav: true })),
    on(AuthActions.logoutConfirmation, () => ({ showSidenav: false }))
  ),
});

export const provideLayout = () =>
  makeEnvironmentProviders([provideState(layoutFeature)]);

/**
 * Layout Selectors
 */
export const selectShowSidenav = layoutFeature.selectShowSidenav;
