import { createActionGroup, props } from '@ngrx/store';

export const findBookPageActions = createActionGroup({
  source: 'Find Book Page',
  events: {
    'Search Books': props<{ query: string }>(),
  },
});
