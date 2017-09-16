import { reducer } from './auth';
import * as fromAuth from './auth';
import { Login, LoginSuccess, Logout } from '../actions/auth';
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

  describe('wrong login payload', () => {
    it('should NOT authenticate a user', () => {
      const user = { username: 'someUserName' } as Authenticate;
      const createAction = new Login(user);

      const expectedResult = fromAuth.initialState;

      const result = reducer(fromAuth.initialState, createAction);

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
