import { createAction, props, union } from '@ngrx/store';

export const searchBooks = createAction(
  '[Find Book Page] Search Books',
  props<{ query: string }>()
);

const all = union({ searchBooks });

export type FindBookPageActionsUnion = typeof all;
