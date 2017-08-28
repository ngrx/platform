import { Action } from '@ngrx/store';
import { Book } from '../models/book';

export const ADD_BOOK = '[Collection] Add Book';
export const ADD_BOOK_SUCCESS = '[Collection] Add Book Success';
export const ADD_BOOK_FAIL = '[Collection] Add Book Fail';
export const REMOVE_BOOK = '[Collection] Remove Book';
export const REMOVE_BOOK_SUCCESS = '[Collection] Remove Book Success';
export const REMOVE_BOOK_FAIL = '[Collection] Remove Book Fail';
export const LOAD = '[Collection] Load';
export const LOAD_SUCCESS = '[Collection] Load Success';
export const LOAD_FAIL = '[Collection] Load Fail';

/**
 * Add Book to Collection Actions
 */
export class AddBook implements Action {
  readonly type = ADD_BOOK;

  constructor(public payload: Book) {}
}

export class AddBookSuccess implements Action {
  readonly type = ADD_BOOK_SUCCESS;

  constructor(public payload: Book) {}
}

export class AddBookFail implements Action {
  readonly type = ADD_BOOK_FAIL;

  constructor(public payload: Book) {}
}

/**
 * Remove Book from Collection Actions
 */
export class RemoveBook implements Action {
  readonly type = REMOVE_BOOK;

  constructor(public payload: Book) {}
}

export class RemoveBookSuccess implements Action {
  readonly type = REMOVE_BOOK_SUCCESS;

  constructor(public payload: Book) {}
}

export class RemoveBookFail implements Action {
  readonly type = REMOVE_BOOK_FAIL;

  constructor(public payload: Book) {}
}

/**
 * Load Collection Actions
 */
export class Load implements Action {
  readonly type = LOAD;
}

export class LoadSuccess implements Action {
  readonly type = LOAD_SUCCESS;

  constructor(public payload: Book[]) {}
}

export class LoadFail implements Action {
  readonly type = LOAD_FAIL;

  constructor(public payload: any) {}
}

export type Actions =
  | AddBook
  | AddBookSuccess
  | AddBookFail
  | RemoveBook
  | RemoveBookSuccess
  | RemoveBookFail
  | Load
  | LoadSuccess
  | LoadFail;
