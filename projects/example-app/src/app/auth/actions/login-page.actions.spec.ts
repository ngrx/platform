import * as LoginPageActions from './login-page.actions';

describe('oginPage Actions', () => {
  describe('Login', () => {
    it('should create an action', () => {
      const payload = { credentials: { username: 'test', password: 'test' } };
      const action = new LoginPageActions.Login(payload);

      expect({ ...action }).toEqual({
        type: LoginPageActions.LoginPageActionTypes.Login,
        payload,
      });
    });
  });
});
