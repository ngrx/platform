import { Action } from '@ngrx/store';
import { Book } from '@example-app/books/models/book';

export enum SelectedBookPageActionTypes {
  AddBook = '[Selected Book Page] Add Book',
  RemoveBook = '[Selected Book Page] Remove Book',
}

/**
 * Add Book to Collection Action
 */
export class AddBook implements Action {
  readonly type = SelectedBookPageActionTypes.AddBook;

  constructor(public payload: Book) {}
}

/**
 * Remove Book from Collection Action
 */
export class RemoveBook implements Action {
  readonly type = SelectedBookPageActionTypes.RemoveBook;

  constructor(public payload: Book) {}
}

export type SelectedBookPageActionsUnion = AddBook | RemoveBook;
