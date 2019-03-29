import { createAction, props } from '@ngrx/store';

export const selectBook = createAction(
  '[View Book Page] Select Book',
  props<{ id: string }>()
);

export type ViewBookPageActionsUnion = ReturnType<typeof selectBook>;
