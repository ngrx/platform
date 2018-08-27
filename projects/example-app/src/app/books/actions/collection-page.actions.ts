import { Action } from '@ngrx/store';

export enum CollectionPageActionTypes {
  LoadCollection = '[Collection Page] Load Collection',
}

/**
 * Load Collection Action
 */
export class LoadCollection implements Action {
  readonly type = CollectionPageActionTypes.LoadCollection;
}

export type CollectionPageActionsUnion = LoadCollection;
