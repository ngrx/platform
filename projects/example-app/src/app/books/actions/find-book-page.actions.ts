import { createActionGroup, props } from '@ngrx/store';

export const FindBookPageActions = createActionGroup({
  source: 'Find Book Page',
  events: {
    'Search Books': props<{ query: string }>(),
  },
});
