import { props, createActionGroup, emptyProps } from '@ngrx/store';
import { User } from '@example-app/auth/models';

export const AuthApiActions = createActionGroup({
  source: 'Auth/API',
  events: {
    'Login Success': props<{ user: User }>(),
    'Login Failure': props<{ error: any }>(),
    'Login Redirect': emptyProps(),
  },
});
