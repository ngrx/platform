import { createActionGroup, props } from '@ngrx/store';
import { Credentials } from '@example-app/auth/models';

export const loginPageActions = createActionGroup({
  source: 'Login Page',
  events: {
    Login: props<{ credentials: Credentials }>(),
  },
});
