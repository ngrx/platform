import { createAction, props } from '@ngrx/store';

import { Book } from '@example-app/books/models';

/**
 * Add Book to Collection Action
 */
export const addBook = createAction(
  '[Selected Book Page] Add Book',
  props<{ book: Book }>()
);

/**
 * Remove Book from Collection Action
 */
export const removeBook = createAction(
  '[Selected Book Page] Remove Book',
  props<{ book: Book }>()
);
