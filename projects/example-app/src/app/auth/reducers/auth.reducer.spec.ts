import { statusFeature } from '@example-app/auth/reducers/auth.reducer';
import * as fromAuth from '@example-app/auth/reducers/auth.reducer';
import { AuthApiActions } from '@example-app/auth/actions/auth-api.actions';
import { AuthActions } from '@example-app/auth/actions/auth.actions';

import { User } from '@example-app/auth/models';

describe('AuthReducer', () => {
  describe('undefined action', () => {
    it('should return the default state', () => {
      const action = {} as any;

      const result = statusFeature.reducer(undefined, action);

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
      const createAction = AuthApiActions.loginSuccess({ user });

      const result = statusFeature.reducer(fromAuth.initialState, createAction);

      expect(result).toMatchSnapshot();
    });
  });

  describe('LOGOUT', () => {
    it('should logout a user', () => {
      const initialState = {
        user: { name: 'test' },
      } as fromAuth.State;
      const createAction = AuthActions.logout();

      const result = statusFeature.reducer(initialState, createAction);

      expect(result).toMatchSnapshot();
    });
  });
});
