import { Action } from '@ngrx/store';
import { Book } from '@example-app/books/models/book';

export enum CollectionApiActionTypes {
  AddBookSuccess = '[Collection/API] Add Book Success',
  AddBookFailure = '[Collection/API] Add Book Failure',
  RemoveBookSuccess = '[Collection/API] Remove Book Success',
  RemoveBookFailure = '[Collection/API] Remove Book Failure',
  LoadBooksSuccess = '[Collection/API] Load Books Success',
  LoadBooksFailure = '[Collection/API] Load Books Failure',
}

/**
 * Add Book to Collection Actions
 */
export class AddBookSuccess implements Action {
  readonly type = CollectionApiActionTypes.AddBookSuccess;

  constructor(public payload: Book) {}
}

export class AddBookFailure implements Action {
  readonly type = CollectionApiActionTypes.AddBookFailure;

  constructor(public payload: Book) {}
}

/**
 * Remove Book from Collection Actions
 */
export class RemoveBookSuccess implements Action {
  readonly type = CollectionApiActionTypes.RemoveBookSuccess;

  constructor(public payload: Book) {}
}

export class RemoveBookFailure implements Action {
  readonly type = CollectionApiActionTypes.RemoveBookFailure;

  constructor(public payload: Book) {}
}

/**
 * Load Collection Actions
 */
export class LoadBooksSuccess implements Action {
  readonly type = CollectionApiActionTypes.LoadBooksSuccess;

  constructor(public payload: Book[]) {}
}

export class LoadBooksFailure implements Action {
  readonly type = CollectionApiActionTypes.LoadBooksFailure;

  constructor(public payload: any) {}
}

export type CollectionApiActionsUnion =
  | AddBookSuccess
  | AddBookFailure
  | RemoveBookSuccess
  | RemoveBookFailure
  | LoadBooksSuccess
  | LoadBooksFailure;
