import { createReducer, on } from '@ngrx/store';

import { collectionApiActions } from '@example-app/books/actions/collection-api.actions';
import { collectionPageActions } from '@example-app/books/actions/collection-page.actions';
import { selectedBookPageActions } from '@example-app/books/actions/selected-book-page.actions';

export const collectionFeatureKey = 'collection';

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

export const reducer = createReducer(
  initialState,
  on(collectionPageActions.enter, (state) => ({
    ...state,
    loading: true,
  })),
  on(collectionApiActions.loadBooksSuccess, (_state, { books }) => ({
    loaded: true,
    loading: false,
    ids: books.map((book) => book.id),
  })),
  /**
   * Optimistically add book to collection.
   * If this succeeds there's nothing to do.
   * If this fails we revert state by removing the book.
   *
   * `on` supports handling multiple types of actions
   */
  on(
    selectedBookPageActions.addBook,
    collectionApiActions.removeBookFailure,
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
  /**
   * Optimistically remove book from collection.
   * If addBook fails, we "undo" adding the book.
   */
  on(
    selectedBookPageActions.removeBook,
    collectionApiActions.addBookFailure,
    (state, { book }) => ({
      ...state,
      ids: state.ids.filter((id) => id !== book.id),
    })
  )
);

export const getLoaded = (state: State) => state.loaded;

export const getLoading = (state: State) => state.loading;

export const getIds = (state: State) => state.ids;
