import { Book } from '@example-app/books/models';
import { createSelector, provideState } from '@ngrx/store';
import { searchFeature } from '@example-app/books/reducers/search.reducer';
import * as fromBooks from '@example-app/books/reducers/books.reducer';
import { booksFeature } from '@example-app/books/reducers/books.reducer';
import { collectionFeature } from '@example-app/books/reducers/collection.reducer';
import { makeEnvironmentProviders } from '@angular/core';
import { provideEffects } from '@ngrx/effects';
import { BookEffects, CollectionEffects } from '@example-app/books/effects';

export const provideBooks = () =>
  makeEnvironmentProviders([
    provideState(booksFeature),
    provideState(collectionFeature),
    provideState(searchFeature),
    provideEffects(BookEffects, CollectionEffects),
  ]);

/**
 * A selector function is a map function factory. We pass it parameters and it
 * returns a function that maps from the larger state tree into a smaller
 * piece of state.
 *
 * Selectors are used with the `select` or `selectSignal` operator.
 *
 * ```ts
 * class MyComponent {
 *   constructor(state$: Observable<State>) {
 *     this.booksState$ = state$.select(getBooksState);
 *   }
 * }
 * ```
 *
 * Every reducer module exports selector functions, however child reducers
 * have no knowledge of the overall state tree. To make them usable, we
 * need to make new selectors that wrap them.
 *
 * The createSelector function creates very efficient selectors that are memoized and
 * only recompute when arguments change. The created selectors can also be composed
 * together to select different pieces of state.
 */

export const selectSelectedBookId = booksFeature.selectSelectedBookId;

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
} = fromBooks.adapter.getSelectors(booksFeature.selectBooksState);

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

export const selectSearchBookIds = searchFeature.selectIds;
export const selectSearchQuery = searchFeature.selectQuery;
export const selectSearchLoading = searchFeature.selectLoading;
export const selectSearchError = searchFeature.selectError;

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

export const selectCollectionLoaded = collectionFeature.selectLoaded;

export const getCollectionLoading = collectionFeature.selectLoading;

export const selectCollectionBookIds = collectionFeature.selectIds;

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
