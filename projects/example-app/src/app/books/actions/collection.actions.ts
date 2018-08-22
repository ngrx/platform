import { Action } from '@ngrx/store';
import { Book } from '../models/book';

export enum CollectionActionTypes {
  AddBook = '[Collection] Add Book',
  AddBookSuccess = '[Collection] Add Book Success',
  AddBookFail = '[Collection] Add Book Fail',
  RemoveBook = '[Collection] Remove Book',
  RemoveBookSuccess = '[Collection] Remove Book Success',
  RemoveBookFail = '[Collection] Remove Book Fail',
  Load = '[Collection] Load',
  LoadSuccess = '[Collection] Load Success',
  LoadFail = '[Collection] Load Fail',
}

/**
 * Add Book to Collection Actions
 */
export class AddBook implements Action {
  readonly type = CollectionActionTypes.AddBook;

  constructor(public payload: Book) {}
}

export class AddBookSuccess implements Action {
  readonly type = CollectionActionTypes.AddBookSuccess;

  constructor(public payload: Book) {}
}

export class AddBookFail implements Action {
  readonly type = CollectionActionTypes.AddBookFail;

  constructor(public payload: Book) {}
}

/**
 * Remove Book from Collection Actions
 */
export class RemoveBook implements Action {
  readonly type = CollectionActionTypes.RemoveBook;

  constructor(public payload: Book) {}
}

export class RemoveBookSuccess implements Action {
  readonly type = CollectionActionTypes.RemoveBookSuccess;

  constructor(public payload: Book) {}
}

export class RemoveBookFail implements Action {
  readonly type = CollectionActionTypes.RemoveBookFail;

  constructor(public payload: Book) {}
}

/**
 * Load Collection Actions
 */
export class Load implements Action {
  readonly type = CollectionActionTypes.Load;
}

export class LoadSuccess implements Action {
  readonly type = CollectionActionTypes.LoadSuccess;

  constructor(public payload: Book[]) {}
}

export class LoadFail implements Action {
  readonly type = CollectionActionTypes.LoadFail;

  constructor(public payload: any) {}
}

export type CollectionActionsUnion =
  | AddBook
  | AddBookSuccess
  | AddBookFail
  | RemoveBook
  | RemoveBookSuccess
  | RemoveBookFail
  | Load
  | LoadSuccess
  | LoadFail;
