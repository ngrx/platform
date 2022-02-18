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
  // Even though the `state` is unused, it helps infer the return type
  on(LayoutActions.closeSidenav, (_state) => ({ showSidenav: false })),
  on(LayoutActions.openSidenav, (_state) => ({ showSidenav: true })),
  on(AuthActions.logoutConfirmation, (_state) => ({ showSidenav: false }))
);

export const selectShowSidenav = (state: State) => state.showSidenav;
