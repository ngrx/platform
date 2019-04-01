import { createAction, union, props } from '@ngrx/store';
import { Book } from '@example-app/books/models/book';

export const searchSuccess = createAction(
  '[Books/API] Search Success',
  props<{ books: Book[] }>()
);

export const searchFailure = createAction(
  '[Books/API] Search Failure',
  props<{ errorMsg: string }>()
);

/**
 * Export a type alias of all actions in this action group
 * so that reducers can easily compose action types
 */
const all = union({ searchSuccess, searchFailure });
export type BooksApiActionsUnion = typeof all;
