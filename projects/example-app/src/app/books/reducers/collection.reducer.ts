import {
  SelectedBookPageActions,
  CollectionPageActions,
  CollectionApiActions,
} from '@example-app/books/actions';
import { createReducer, on } from '@ngrx/store';

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

export const reducer = createReducer<State>(
  [
    on(CollectionPageActions.loadCollection, state => ({
      ...state,
      loading: true,
    })),
    on(CollectionApiActions.loadBooksSuccess, (state, { books }) => ({
      loaded: true,
      loading: false,
      ids: books.map(book => book.id),
    })),
    // Supports handing multiple types of actions
    on(
      CollectionApiActions.addBookSuccess,
      CollectionApiActions.removeBookFailure,
      (state, { book }) => {
        if (state.ids.indexOf(book.id) > -1) {
          return state;
        }
        return {
          ...state,
          ids: [...state.ids, book.id],
        };
      }
    ),
    on(
      CollectionApiActions.removeBookSuccess,
      CollectionApiActions.addBookFailure,
      (state, { book }) => ({
        ...state,
        ids: state.ids.filter(id => id !== book.id),
      })
    ),
  ],
  initialState
);

export const getLoaded = (state: State) => state.loaded;

export const getLoading = (state: State) => state.loading;

export const getIds = (state: State) => state.ids;
