import { createAction, union, props } from '@ngrx/store';

export const selectBook = createAction(
  '[View Book Page] Select Book',
  props<{ id: string }>()
);

const all = union({ selectBook });
export type ViewBookPageActionsUnion = typeof all;
