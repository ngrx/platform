import { createActionGroup, emptyProps } from '@ngrx/store';

export const UserActions = createActionGroup({
  source: 'User',
  events: {
    'Idle Timeout': emptyProps(),
  },
});
