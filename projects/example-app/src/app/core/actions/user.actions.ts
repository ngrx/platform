import { createActionGroup, emptyProps } from '@ngrx/store';

export const userActions = createActionGroup({
  source: 'User',
  events: {
    'Idle Timeout': emptyProps(),
  },
});
