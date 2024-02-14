import { createActionGroup, props } from '@ngrx/store';

export const ViewBookPageActions = createActionGroup({
  source: 'View Book Page',
  events: {
    'Select Book': props<{ id: string }>(),
  },
});
