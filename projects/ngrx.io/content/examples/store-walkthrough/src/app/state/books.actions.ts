import { createAction, props } from '@ngrx/store';
import { Book } from '../book-list/book-list.model';

export const addBook = createAction(
  '[Book List] Add Book',
  props<{ bookId: number }>()
);

export const removeBook = createAction(
  '[Book Collection] Remove Book',
  props<{ bookId: number }>()
);

export const retrievedBookList = createAction(
  '[Book List/API] Retrieve Books Success',
  props<{ book: Book }>()
);
