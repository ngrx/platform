import { BooksApiActions } from '@example-app/books/actions/books-api.actions';
import { FindBookPageActions } from '@example-app/books/actions/find-book-page.actions';
import { createFeature, createReducer, on } from '@ngrx/store';

export interface State {
  ids: string[];
  loading: boolean;
  error: string;
  query: string;
}

const initialState: State = {
  ids: [],
  loading: false,
  error: '',
  query: '',
};

export const searchFeature = createFeature({
  name: 'booksSearch',
  reducer: createReducer(
    initialState,
    on(FindBookPageActions.searchBooks, (state, { query }) => {
      return query === ''
        ? {
            ids: [],
            loading: false,
            error: '',
            query,
          }
        : {
            ...state,
            loading: true,
            error: '',
            query,
          };
    }),
    on(BooksApiActions.searchSuccess, (state, { books }) => ({
      ids: books.map((book) => book.id),
      loading: false,
      error: '',
      query: state.query,
    })),
    on(BooksApiActions.searchFailure, (state, { errorMsg }) => ({
      ...state,
      loading: false,
      error: errorMsg,
    }))
  ),
});

export const getIds = searchFeature.selectIds;

export const getQuery = searchFeature.selectQuery;

export const getLoading = searchFeature.selectLoading;

export const getError = searchFeature.selectError;
