import { reducer } from './auth.reducer';
import * as fromAuth from './auth.reducer';
import { LoginSuccess, Logout } from '../actions/auth-api.actions';
import * as loginPageActions from '../actions/login-page.actions';

import { Authenticate, User } from '../models/user';

describe('AuthReducer', () => {
  describe('undefined action', () => {
    it('should return the default state', () => {
      const action = {} as any;

      const result = reducer(undefined, action);

      /**
       * Snapshot tests are a quick way to validate
       * the state produced by a reducer since
       * its plain JavaScript object. These snapshots
       * are used to validate against the current state
       * if the functionality of the reducer ever changes.
       */
      expect(result).toMatchSnapshot();
    });
  });

  describe('LOGIN_SUCCESS', () => {
    it('should add a user set loggedIn to true in auth state', () => {
      const user = { name: 'test' } as User;
      const createAction = new LoginSuccess({ user });

      const expectedResult = {
        loggedIn: true,
        user: { name: 'test' },
      };

      const result = reducer(fromAuth.initialState, createAction);

      expect(result).toMatchSnapshot();
    });
  });

  describe('LOGOUT', () => {
    it('should logout a user', () => {
      const initialState = {
        loggedIn: true,
        user: { name: 'test' },
      } as fromAuth.State;
      const createAction = new Logout();

      const expectedResult = fromAuth.initialState;

      const result = reducer(initialState, createAction);

      expect(result).toMatchSnapshot();
    });
  });
});
