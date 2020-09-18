import { createReducer, on, Action } from '@ngrx/store';

import { retrievedBookList } from './books.actions';
import { Book } from '../book-list/books.model';

export const initialState: ReadonlyArray<Book> = [];

export const booksReducer = createReducer(
  initialState,
  on(retrievedBookList, (state, { Book }) => [...Book])
);
