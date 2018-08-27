import { Action } from '@ngrx/store';

export enum FindBookPageActionTypes {
  SearchBooks = '[Find Book Page] Search Books',
}

export class SearchBooks implements Action {
  readonly type = FindBookPageActionTypes.SearchBooks;

  constructor(public payload: string) {}
}

export type FindBookPageActionsUnion = SearchBooks;
