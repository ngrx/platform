import {
  SelectedBookPageActions,
  CollectionPageActions,
  CollectionApiActions,
} from '@example-app/books/actions';

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
    | SelectedBookPageActions.SelectedBookPageActionsUnion
    | CollectionPageActions.CollectionPageActionsUnion
    | CollectionApiActions.CollectionApiActionsUnion
): State {
  switch (action.type) {
    case CollectionPageActions.loadCollection.type: {
      return {
        ...state,
        loading: true,
      };
    }

    case CollectionApiActions.loadBooksSuccess.type: {
      return {
        loaded: true,
        loading: false,
        ids: action.books.map(book => book.id),
      };
    }

    case CollectionApiActions.addBookSuccess.type:
    case CollectionApiActions.removeBookFailure.type: {
      if (state.ids.indexOf(action.book.id) > -1) {
        return state;
      }

      return {
        ...state,
        ids: [...state.ids, action.book.id],
      };
    }

    case CollectionApiActions.removeBookSuccess.type:
    case CollectionApiActions.addBookFailure.type: {
      return {
        ...state,
        ids: state.ids.filter(id => id !== action.book.id),
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
