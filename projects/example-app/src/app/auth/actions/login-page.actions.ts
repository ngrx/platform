import { createActionGroup, props } from '@ngrx/store';
import { Credentials } from '@example-app/auth/models';

export const LoginPageActions = createActionGroup({
  source: 'Login Page',
  events: {
    Login: props<{ credentials: Credentials }>(),
  },
});
