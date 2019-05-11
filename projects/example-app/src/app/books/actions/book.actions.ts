import { Book } from '@example-app/books/models';
import { createAction, props } from '@ngrx/store';

export const loadBook = createAction(
  '[Book Exists Guard] Load Book',
  props<{ book: Book }>()
);
