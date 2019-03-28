import { createAction, props, union } from '@ngrx/store';
import { Book } from '@example-app/books/models/book';

export const loadBook = createAction(
  '[Book Exists Guard] Load Book',
  props<{ book: Book }>()
);

const all = union({ loadBook });
export type BookActionsUnion = typeof all;
