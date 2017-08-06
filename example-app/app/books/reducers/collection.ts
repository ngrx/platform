import * as collection from '../actions/collection';

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
  action: collection.Actions
): State {
  switch (action.type) {
    case collection.LOAD: {
      return {
        ...state,
        loading: true,
      };
    }

    case collection.LOAD_SUCCESS: {
      return {
        loaded: true,
        loading: false,
        ids: action.payload.map(book => book.id),
      };
    }

    case collection.ADD_BOOK_SUCCESS:
    case collection.REMOVE_BOOK_FAIL: {
      if (state.ids.indexOf(action.payload.id) > -1) {
        return state;
      }

      return {
        ...state,
        ids: [...state.ids, action.payload.id],
      };
    }

    case collection.REMOVE_BOOK_SUCCESS:
    case collection.ADD_BOOK_FAIL: {
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
