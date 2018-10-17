import * as AuthActions from './auth.actions';

describe('Auth Actions', () => {
  describe('Logout', () => {
    it('should create an action', () => {
      const action = new AuthActions.Logout();

      expect({ ...action }).toEqual({
        type: AuthActions.AuthActionTypes.Logout,
      });
    });
  });

  describe('LogoutConfirmation', () => {
    it('should create an action', () => {
      const action = new AuthActions.LogoutConfirmation();

      expect({ ...action }).toEqual({
        type: AuthActions.AuthActionTypes.LogoutConfirmation,
      });
    });
  });

  describe('LogoutConfirmationDismiss', () => {
    it('should create an action', () => {
      const action = new AuthActions.LogoutConfirmationDismiss();

      expect({ ...action }).toEqual({
        type: AuthActions.AuthActionTypes.LogoutConfirmationDismiss,
      });
    });
  });
});
