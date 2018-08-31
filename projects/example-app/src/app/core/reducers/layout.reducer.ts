import {
  LayoutActions
} from '@example-app/core/actions';

export interface State {
  showSidenav: boolean;
}

const initialState: State = {
  showSidenav: false,
};

export function reducer(
  state: State = initialState,
  action: LayoutActions.LayoutActionsUnion
): State {
  switch (action.type) {
    case LayoutActions.LayoutActionTypes.CloseSidenav:
      return {
        showSidenav: false,
      };

    case LayoutActions.LayoutActionTypes.OpenSidenav:
      return {
        showSidenav: true,
      };

    default:
      return state;
  }
}

export const getShowSidenav = (state: State) => state.showSidenav;
