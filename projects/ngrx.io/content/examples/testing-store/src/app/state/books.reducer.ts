import { createReducer, on, Action } from '@ngrx/store';

import { retrievedBookList } from './allBooks.actions';
import { Book } from '../book-list/books.service';

export const initialState = [];

export const booksReducer = createReducer<Array<Book>>(
  initialState,
  on(retrievedBookList, (state, { books }) => [...books])
)