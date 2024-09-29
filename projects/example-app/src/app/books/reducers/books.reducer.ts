import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createFeature, createReducer, on } from '@ngrx/store';

import { BooksApiActions } from '@example-app/books/actions/books-api.actions';
import { BookActions } from '@example-app/books/actions/book.actions';
import { CollectionApiActions } from '@example-app/books/actions/collection-api.actions';
import { ViewBookPageActions } from '@example-app/books/actions/view-book-page.actions';
import { Book } from '@example-app/books/models';

/**
 * @ngrx/entity provides a predefined interface for handling
 * a structured dictionary of records. This interface
 * includes an array of ids, and a dictionary of the provided
 * model type by id. This interface is extended to include
 * any additional interface properties.
 */
export interface State extends EntityState<Book> {
  selectedBookId: string | null;
}

/**
 * createEntityAdapter creates an object of many helper
 * functions for single or multiple operations
 * against the dictionary of records. The configuration
 * object takes a record id selector function and
 * a sortComparer option which is set to a compare
 * function if the records are to be sorted.
 */
export const adapter: EntityAdapter<Book> = createEntityAdapter<Book>({
  selectId: (book: Book) => book.id,
  sortComparer: false,
});

/**
 * getInitialState returns the default initial state
 * for the generated entity state. Initial state
 * additional properties can also be defined.
 */
export const initialState: State = adapter.getInitialState({
  selectedBookId: null,
});

export const booksFeature = createFeature({
  name: 'books',
  reducer: createReducer(
    initialState,
    /**
     * The addMany function provided by the created adapter
     * adds many records to the entity dictionary
     * and returns a new state including those records. If
     * the collection is to be sorted, the adapter will
     * sort each record upon entry into the sorted array.
     */
    on(
      BooksApiActions.searchSuccess,
      CollectionApiActions.loadBooksSuccess,
      (state, { books }) => adapter.addMany(books, state)
    ),
    /**
     * The addOne function provided by the created adapter
     * adds one record to the entity dictionary
     * and returns a new state including that records if it doesn't
     * exist already. If the collection is to be sorted, the adapter will
     * insert the new record into the sorted array.
     */
    on(BookActions.loadBook, (state, { book }) => adapter.addOne(book, state)),
    on(ViewBookPageActions.selectBook, (state, { id }) => ({
      ...state,
      selectedBookId: id,
    }))
  ),
});
