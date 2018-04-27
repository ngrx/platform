import {
  createSelector,
  createFeatureSelector,
  ActionReducerMap,
} from '@ngrx/store';
import * as fromSearch from './search.reducer';
import * as fromBooks from './books.reducer';
import * as fromCollection from './collection.reducer';
import * as fromRoot from '../../reducers';

export interface BooksState {
  search: fromSearch.State;
  books: fromBooks.State;
  collection: fromCollection.State;
}

export interface State extends fromRoot.State {
  books: BooksState;
}

export const reducers: ActionReducerMap<BooksState> = {
  search: fromSearch.reducer,
  books: fromBooks.reducer,
  collection: fromCollection.reducer,
};

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
export const getBooksState = createFeatureSelector<BooksState>('books');

/**
 * Every reducer module exports selector functions, however child reducers
 * have no knowledge of the overall state tree. To make them usable, we
 * need to make new selectors that wrap them.
 *
 * The createSelector function creates very efficient selectors that are memoized and
 * only recompute when arguments change. The created selectors can also be composed
 * together to select different pieces of state.
 */
export const getBookEntitiesState = createSelector(
  getBooksState,
  state => state.books
);

export const getSelectedBookId = createSelector(
  getBookEntitiesState,
  fromBooks.getSelectedId
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
  selectIds: getBookIds,
  selectEntities: getBookEntities,
  selectAll: getAllBooks,
  selectTotal: getTotalBooks,
} = fromBooks.adapter.getSelectors(getBookEntitiesState);

export const getSelectedBook = createSelector(
  getBookEntities,
  getSelectedBookId,
  (entities, selectedId) => {
    return selectedId && entities[selectedId];
  }
);

/**
 * Just like with the books selectors, we also have to compose the search
 * reducer's and collection reducer's selectors.
 */
export const getSearchState = createSelector(
  getBooksState,
  (state: BooksState) => state.search
);

export const getSearchBookIds = createSelector(
  getSearchState,
  fromSearch.getIds
);
export const getSearchQuery = createSelector(
  getSearchState,
  fromSearch.getQuery
);
export const getSearchLoading = createSelector(
  getSearchState,
  fromSearch.getLoading
);
export const getSearchError = createSelector(
  getSearchState,
  fromSearch.getError
);

/**
 * Some selector functions create joins across parts of state. This selector
 * composes the search result IDs to return an array of books in the store.
 */
export const getSearchResults = createSelector(
  getBookEntities,
  getSearchBookIds,
  (books, searchIds) => {
    return searchIds.map(id => books[id]);
  }
);

export const getCollectionState = createSelector(
  getBooksState,
  (state: BooksState) => state.collection
);

export const getCollectionLoaded = createSelector(
  getCollectionState,
  fromCollection.getLoaded
);
export const getCollectionLoading = createSelector(
  getCollectionState,
  fromCollection.getLoading
);
export const getCollectionBookIds = createSelector(
  getCollectionState,
  fromCollection.getIds
);

export const getBookCollection = createSelector(
  getBookEntities,
  getCollectionBookIds,
  (entities, ids) => {
    return ids.map(id => entities[id]);
  }
);

export const isSelectedBookInCollection = createSelector(
  getCollectionBookIds,
  getSelectedBookId,
  (ids, selected) => {
    return ids.indexOf(selected) > -1;
  }
);
