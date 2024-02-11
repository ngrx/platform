import { createActionGroup, emptyProps } from '@ngrx/store';

export const authActions = createActionGroup({
  source: 'Auth',
  events: {
    Logout: emptyProps(),
    'Logout Confirmation': emptyProps(),
    'Logout Confirmation Dismiss': emptyProps(),
  },
});
