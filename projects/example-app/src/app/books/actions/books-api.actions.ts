import { Action } from '@ngrx/store';
import { Book } from '@example-app/books/models/book';

export enum BooksApiActionTypes {
  SearchSuccess = '[Books/API] Search Success',
  SearchFailure = '[Books/API] Search Failure',
}

/**
 * Every action is comprised of at least a type and an optional
 * payload. Expressing actions as classes enables powerful
 * type checking in reducer functions.
 *
 * See Discriminated Unions: https://www.typescriptlang.org/docs/handbook/advanced-types.html#discriminated-unions
 */
export class SearchSuccess implements Action {
  readonly type = BooksApiActionTypes.SearchSuccess;

  constructor(public payload: Book[]) {}
}

export class SearchFailure implements Action {
  readonly type = BooksApiActionTypes.SearchFailure;

  constructor(public payload: string) {}
}

/**
 * Export a type alias of all actions in this action group
 * so that reducers can easily compose action types
 */
export type BooksApiActionsUnion = SearchSuccess | SearchFailure;
