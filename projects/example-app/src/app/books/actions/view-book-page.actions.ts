import { Action } from '@ngrx/store';

export enum ViewBookPageActionTypes {
  SelectBook = '[View Book Page] Select Book',
}

export class SelectBook implements Action {
  readonly type = ViewBookPageActionTypes.SelectBook;

  constructor(public payload: string) {}
}

export type ViewBookPageActionsUnion = SelectBook;
