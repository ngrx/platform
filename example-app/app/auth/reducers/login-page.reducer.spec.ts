import { reducer } from './login-page.reducer';
import * as fromLoginPage from './login-page.reducer';
import {
  Login,
  LoginSuccess,
  LoginFailure,
  Logout,
} from '../actions/auth.actions';
import { Authenticate, User } from '../models/user';

describe('LoginPageReducer', () => {
  describe('undefined action', () => {
    it('should return the default state', () => {
      const action = {} as any;

      const result = reducer(undefined, action);

      expect(result).toMatchSnapshot();
    });
  });

  describe('LOGIN', () => {
    it('should make pending to true', () => {
      const user = { username: 'test' } as Authenticate;
      const createAction = new Login(user);

      const expectedResult = {
        error: null,
        pending: true,
      };

      const result = reducer(fromLoginPage.initialState, createAction);

      expect(result).toMatchSnapshot();
    });
  });

  describe('LOGIN_SUCCESS', () => {
    it('should have no error and no pending state', () => {
      const user = { name: 'test' } as User;
      const createAction = new LoginSuccess({ user });

      const expectedResult = {
        error: null,
        pending: false,
      };

      const result = reducer(fromLoginPage.initialState, createAction);

      expect(result).toMatchSnapshot();
    });
  });

  describe('LOGIN_FAILURE', () => {
    it('should have an error and no pending state', () => {
      const error = 'login failed';
      const createAction = new LoginFailure(error);

      const expectedResult = {
        error: error,
        pending: false,
      };

      const result = reducer(fromLoginPage.initialState, createAction);

      expect(result).toMatchSnapshot();
    });
  });
});
