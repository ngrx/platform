import { Action } from '@ngrx/store';
import { Book } from '../models/book';

export const SEARCH = '[Book] Search';
export const SEARCH_COMPLETE = '[Book] Search Complete';
export const SEARCH_ERROR = '[Book] Search Error';
export const LOAD = '[Book] Load';
export const SELECT = '[Book] Select';

/**
 * Every action is comprised of at least a type and an optional
 * payload. Expressing actions as classes enables powerful
 * type checking in reducer functions.
 *
 * See Discriminated Unions: https://www.typescriptlang.org/docs/handbook/advanced-types.html#discriminated-unions
 */
export class Search implements Action {
  readonly type = SEARCH;

  constructor(public payload: string) {}
}

export class SearchComplete implements Action {
  readonly type = SEARCH_COMPLETE;

  constructor(public payload: Book[]) {}
}

export class SearchError implements Action {
  readonly type = SEARCH_ERROR;

  constructor(public payload: string) {}
}

export class Load implements Action {
  readonly type = LOAD;

  constructor(public payload: Book) {}
}

export class Select implements Action {
  readonly type = SELECT;

  constructor(public payload: string) {}
}

/**
 * Export a type alias of all actions in this action group
 * so that reducers can easily compose action types
 */
export type Actions = Search | SearchComplete | SearchError | Load | Select;
