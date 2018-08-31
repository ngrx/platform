import { Action } from '@ngrx/store';
import { Book } from '@example-app/books/models/book';

export enum BookActionTypes {
  LoadBook = '[Book Exists Guard] Load Book',
}

export class LoadBook implements Action {
  readonly type = BookActionTypes.LoadBook;

  constructor(public payload: Book) {}
}

export type BookActionsUnion = LoadBook;
