import { createReducer, on } from '@ngrx/store';

import { layoutActions } from '@example-app/core/actions/layout.actions';
import { authActions } from '@example-app/auth/actions/auth.actions';

export const layoutFeatureKey = 'layout';

export interface State {
  showSidenav: boolean;
}

const initialState: State = {
  showSidenav: false,
};

export const reducer = createReducer(
  initialState,
  on(layoutActions.closeSidenav, () => ({ showSidenav: false })),
  on(layoutActions.openSidenav, () => ({ showSidenav: true })),
  on(authActions.logoutConfirmation, () => ({ showSidenav: false }))
);

export const selectShowSidenav = (state: State) => state.showSidenav;
