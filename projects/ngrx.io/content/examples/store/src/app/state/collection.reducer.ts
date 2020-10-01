import { createReducer, on, Action } from '@ngrx/store';
import { addBook, removeBook } from './allBooks.actions';

export const initialState = [];

export const collectionReducer = createReducer<Array<string>>(
  initialState,
  on(removeBook, (state, { bookId }) => state.filter((id) => id !== bookId)),
  on(addBook, (state, { bookId }) => {
    if (state.indexOf(bookId) > -1) return state;

    return [...state, bookId];
  })
);
