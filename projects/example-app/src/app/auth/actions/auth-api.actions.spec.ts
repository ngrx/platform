import * as AuthApiActions from './auth-api.actions';

describe('AuthApi Actions', () => {
  describe('LoginSuccess', () => {
    it('should create an action', () => {
      const payload = { user: { name: 'test' } };
      const action = new AuthApiActions.LoginSuccess(payload);

      expect({ ...action }).toEqual({
        type: AuthApiActions.AuthApiActionTypes.LoginSuccess,
        payload,
      });
    });
  });

  describe('LoginFailure', () => {
    it('should create an action', () => {
      const payload = { error: 'some error' };
      const action = new AuthApiActions.LoginFailure(payload);

      expect({ ...action }).toEqual({
        type: AuthApiActions.AuthApiActionTypes.LoginFailure,
        payload,
      });
    });
  });

  describe('LoginRedirect', () => {
    it('should create an action', () => {
      const action = new AuthApiActions.LoginRedirect();

      expect({ ...action }).toEqual({
        type: AuthApiActions.AuthApiActionTypes.LoginRedirect,
      });
    });
  });
});
