import { createReducer, on } from '@ngrx/store';
import { LayoutActions } from '@example-app/core/actions';

export interface State {
  showSidenav: boolean;
}

const initialState: State = {
  showSidenav: false,
};

export const reducer = createReducer<State>(
  [
    // Explicit 'State' return type for the 'on' functions is needed because
    // otherwise the return types are narrowed to showSidenav: false instead of
    // showSidenav: boolean (that State is asking for).
    on(LayoutActions.closeSidenav, state => ({ showSidenav: false })),
    on(LayoutActions.openSidenav, state => ({ showSidenav: true })),
  ],
  initialState
);

export const getShowSidenav = (state: State) => state.showSidenav;
