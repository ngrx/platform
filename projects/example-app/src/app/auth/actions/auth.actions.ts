import { createActionGroup, emptyProps } from '@ngrx/store';

export const AuthActions = createActionGroup({
  source: 'Auth',
  events: {
    Logout: emptyProps(),
    'Logout Confirmation': emptyProps(),
    'Logout Confirmation Dismiss': emptyProps(),
  },
});
