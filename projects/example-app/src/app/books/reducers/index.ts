import { Book } from '@example-app/books/models';
import {
  createSelector,
  createFeatureSelector,
  combineReducers,
  Action,
} from '@ngrx/store';
import * as fromSearch from '@example-app/books/reducers/search.reducer';
import * as fromBooks from '@example-app/books/reducers/books.reducer';
import * as fromCollection from '@example-app/books/reducers/collection.reducer';
import * as fromRoot from '@example-app/reducers';

export const booksFeatureKey = 'books';

export interface BooksState {
  [fromSearch.searchFeatureKey]: fromSearch.State;
  [fromBooks.booksFeatureKey]: fromBooks.State;
  [fromCollection.collectionFeatureKey]: fromCollection.State;
}

export interface State extends fromRoot.State {
  [booksFeatureKey]: BooksState;
}

/** Provide reducer in AoT-compilation happy way */
export function reducers(state: BooksState | undefined, action: Action) {
  return combineReducers({
    [fromSearch.searchFeatureKey]: fromSearch.reducer,
    [fromBooks.booksFeatureKey]: fromBooks.reducer,
    [fromCollection.collectionFeatureKey]: fromCollection.reducer,
  })(state, action);
}

/**
 * A selector function is a map function factory. We pass it parameters and it
 * returns a function that maps from the larger state tree into a smaller
 * piece of state. This selector simply selects the `books` state.
 *
 * Selectors are used with the `select` operator.
 *
 * ```ts
 * class MyComponent {
 *   constructor(state$: Observable<State>) {
 *     this.booksState$ = state$.pipe(select(getBooksState));
 *   }
 * }
 * ```
 */

/**
 * The createFeatureSelector function selects a piece of state from the root of the state object.
 * This is used for selecting feature states that are loaded eagerly or lazily.
 */
export const selectBooksState = createFeatureSelector<BooksState>(
  booksFeatureKey
);

/**
 * Every reducer module exports selector functions, however child reducers
 * have no knowledge of the overall state tree. To make them usable, we
 * need to make new selectors that wrap them.
 *
 * The createSelector function creates very efficient selectors that are memoized and
 * only recompute when arguments change. The created selectors can also be composed
 * together to select different pieces of state.
 */
export const selectBookEntitiesState = createSelector(
  selectBooksState,
  (state) => state.books
);

export const selectSelectedBookId = createSelector(
  selectBookEntitiesState,
  fromBooks.selectId
);

/**
 * Adapters created with @ngrx/entity generate
 * commonly used selector functions including
 * getting all ids in the record set, a dictionary
 * of the records by id, an array of records and
 * the total number of records. This reduces boilerplate
 * in selecting records from the entity state.
 */
export const {
  selectIds: selectBookIds,
  selectEntities: selectBookEntities,
  selectAll: selectAllBooks,
  selectTotal: selectTotalBooks,
} = fromBooks.adapter.getSelectors(selectBookEntitiesState);

export const selectSelectedBook = createSelector(
  selectBookEntities,
  selectSelectedBookId,
  (entities, selectedId) => {
    return selectedId && entities[selectedId];
  }
);

/**
 * Just like with the books selectors, we also have to compose the search
 * reducer's and collection reducer's selectors.
 */
export const selectSearchState = createSelector(
  selectBooksState,
  (state) => state.search
);

export const selectSearchBookIds = createSelector(
  selectSearchState,
  fromSearch.getIds
);
export const selectSearchQuery = createSelector(
  selectSearchState,
  fromSearch.getQuery
);
export const selectSearchLoading = createSelector(
  selectSearchState,
  fromSearch.getLoading
);
export const selectSearchError = createSelector(
  selectSearchState,
  fromSearch.getError
);

/**
 * Some selector functions create joins across parts of state. This selector
 * composes the search result IDs to return an array of books in the store.
 */
export const selectSearchResults = createSelector(
  selectBookEntities,
  selectSearchBookIds,
  (books, searchIds) => {
    return searchIds
      .map((id) => books[id])
      .filter((book): book is Book => book != null);
  }
);

export const selectCollectionState = createSelector(
  selectBooksState,
  (state) => state.collection
);

export const selectCollectionLoaded = createSelector(
  selectCollectionState,
  fromCollection.getLoaded
);
export const getCollectionLoading = createSelector(
  selectCollectionState,
  fromCollection.getLoading
);
export const selectCollectionBookIds = createSelector(
  selectCollectionState,
  fromCollection.getIds
);

export const selectBookCollection = createSelector(
  selectBookEntities,
  selectCollectionBookIds,
  (entities, ids) => {
    return ids
      .map((id) => entities[id])
      .filter((book): book is Book => book != null);
  }
);

export const isSelectedBookInCollection = createSelector(
  selectCollectionBookIds,
  selectSelectedBookId,
  (ids, selected) => {
    return !!selected && ids.indexOf(selected) > -1;
  }
);
