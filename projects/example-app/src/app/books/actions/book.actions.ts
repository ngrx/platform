import { createAction, props } from '@ngrx/store';
import { Book } from '@example-app/books/models/book';

export const loadBook = createAction(
  '[Book Exists Guard] Load Book',
  props<{ book: Book }>()
);
