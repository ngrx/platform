import * as ViewBookPageActions from './view-book-page.actions';

describe('ViewBookPageActions Actions', () => {
  describe('SelectBook', () => {
    it('should create an action', () => {
      const payload = 'some selected book';
      const action = new ViewBookPageActions.SelectBook(payload);

      expect({ ...action }).toEqual({
        type: ViewBookPageActions.ViewBookPageActionTypes.SelectBook,
        payload,
      });
    });
  });
});
