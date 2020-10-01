import { createAction, props } from '@ngrx/store';
import { Book } from '../book-list/books.service';

export const addBook = createAction(
  '[Book List] Add Book',
  props<{ bookId }>()
);

export const removeBook = createAction(
  '[Book Collection] Remove Book',
  props<{ bookId }>()
);

export const retrievedBookList = createAction(
  '[Book List] Get all books success',
  props<{ Book }>()
);
