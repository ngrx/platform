import { createAction, props } from '@ngrx/store';

import { Book } from '@example-app/books/models';

/**
 * Add Book to Collection Actions
 */
export const addBookSuccess = createAction(
  '[Collection/API] Add Book Success',
  props<{ book: Book }>()
);

export const addBookFailure = createAction(
  '[Collection/API] Add Book Failure',
  props<{ book: Book }>()
);

/**
 * Remove Book from Collection Actions
 */
export const removeBookSuccess = createAction(
  '[Collection/API] Remove Book Success',
  props<{ book: Book }>()
);

export const removeBookFailure = createAction(
  '[Collection/API] Remove Book Failure',
  props<{ book: Book }>()
);

/**
 * Load Collection Actions
 */
export const loadBooksSuccess = createAction(
  '[Collection/API] Load Books Success',
  props<{ books: Book[] }>()
);

export const loadBooksFailure = createAction(
  '[Collection/API] Load Books Failure',
  props<{ error: any }>()
);
