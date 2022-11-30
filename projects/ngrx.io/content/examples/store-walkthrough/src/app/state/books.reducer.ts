import { createReducer, on } from '@ngrx/store';

import { BooksActions } from './books.actions';
import { Book } from '../book-list/books.model';

export const initialState: ReadonlyArray<Book> = [];

export const booksReducer = createReducer(
  initialState,
  on(BooksActions.retrievedBookList, (state, { books }) => books)
);
