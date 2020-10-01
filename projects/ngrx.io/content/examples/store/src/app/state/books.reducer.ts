import { createReducer, on, Action } from '@ngrx/store';

import { retrievedBookList } from './allBooks.actions';
import { Book } from '../book-list/books.service';

export const initialState: ReadonlyArray<Book> = [];

export const booksReducer = createReducer(
  initialState,
  on(retrievedBookList, (state, { Book }) => [...Book])
);
