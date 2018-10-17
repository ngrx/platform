import * as fromLayout from './layout.actions';

describe('Layout Actions', () => {
  describe('OpenSidenav', () => {
    it('should create an action', () => {
      const action = new fromLayout.OpenSidenav();
      expect({ ...action }).toEqual({
        type: fromLayout.LayoutActionTypes.OpenSidenav,
      });
    });
  });

  describe('CloseSidenav', () => {
    it('should create an action', () => {
      const action = new fromLayout.CloseSidenav();

      expect({ ...action }).toEqual({
        type: fromLayout.LayoutActionTypes.CloseSidenav,
      });
    });
  });
});
