import * as fromLoginPage from '@example-app/auth/reducers/login-page.reducer';

import { LoginPageActions } from '@example-app/auth/actions/login-page.actions';
import { AuthApiActions } from '@example-app/auth/actions/auth-api.actions';

import { Credentials, User } from '@example-app/auth/models';
import { loginPageFeature } from '@example-app/auth/reducers/login-page.reducer';

describe('LoginPageReducer', () => {
  describe('undefined action', () => {
    it('should return the default state', () => {
      const action = {} as any;

      const result = loginPageFeature.reducer(undefined, action);

      expect(result).toMatchSnapshot();
    });
  });

  describe('LOGIN', () => {
    it('should make pending to true', () => {
      const user = { username: 'test' } as Credentials;
      const createAction = LoginPageActions.login({ credentials: user });

      const result = loginPageFeature.reducer(
        fromLoginPage.initialState,
        createAction
      );

      expect(result).toMatchSnapshot();
    });
  });

  describe('LOGIN_SUCCESS', () => {
    it('should have no error and no pending state', () => {
      const user = { name: 'test' } as User;
      const createAction = AuthApiActions.loginSuccess({ user });

      const result = loginPageFeature.reducer(
        fromLoginPage.initialState,
        createAction
      );

      expect(result).toMatchSnapshot();
    });
  });

  describe('LOGIN_FAILURE', () => {
    it('should have an error and no pending state', () => {
      const error = 'login failed';
      const createAction = AuthApiActions.loginFailure({ error });

      const result = loginPageFeature.reducer(
        fromLoginPage.initialState,
        createAction
      );

      expect(result).toMatchSnapshot();
    });
  });
});
