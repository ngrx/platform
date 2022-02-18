import { createReducer, on } from '@ngrx/store';

import { LayoutActions } from '@example-app/core/actions';
import { AuthActions } from '@example-app/auth/actions';

export const layoutFeatureKey = 'layout';

export interface State {
  showSidenav: boolean;
}

const initialState: State = {
  showSidenav: false,
};

export const reducer = createReducer(
  initialState,
  on(LayoutActions.closeSidenav, () => ({ showSidenav: false })),
  on(LayoutActions.openSidenav, () => ({ showSidenav: true })),
  on(AuthActions.logoutConfirmation, () => ({ showSidenav: false }))
);

export const selectShowSidenav = (state: State) => state.showSidenav;
