import { SelectedBookPageActionsUnion } from '../actions/selected-book-page.actions';
import {
  CollectionPageActionTypes,
  CollectionPageActionsUnion,
} from './../actions/collection-page.actions';
import {
  CollectionApiActionTypes,
  CollectionApiActionsUnion,
} from './../actions/collection-api.actions';

export interface State {
  loaded: boolean;
  loading: boolean;
  ids: string[];
}

const initialState: State = {
  loaded: false,
  loading: false,
  ids: [],
};

export function reducer(
  state = initialState,
  action:
    | SelectedBookPageActionsUnion
    | CollectionPageActionsUnion
    | CollectionApiActionsUnion
): State {
  switch (action.type) {
    case CollectionPageActionTypes.LoadCollection: {
      return {
        ...state,
        loading: true,
      };
    }

    case CollectionApiActionTypes.LoadBooksSuccess: {
      return {
        loaded: true,
        loading: false,
        ids: action.payload.map(book => book.id),
      };
    }

    case CollectionApiActionTypes.AddBookSuccess:
    case CollectionApiActionTypes.RemoveBookFailure: {
      if (state.ids.indexOf(action.payload.id) > -1) {
        return state;
      }

      return {
        ...state,
        ids: [...state.ids, action.payload.id],
      };
    }

    case CollectionApiActionTypes.RemoveBookSuccess:
    case CollectionApiActionTypes.AddBookFailure: {
      return {
        ...state,
        ids: state.ids.filter(id => id !== action.payload.id),
      };
    }

    default: {
      return state;
    }
  }
}

export const getLoaded = (state: State) => state.loaded;

export const getLoading = (state: State) => state.loading;

export const getIds = (state: State) => state.ids;
