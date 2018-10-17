import * as FindBookPageActions from './find-book-page.actions';

describe('fromFindBook Actions', () => {
  describe('SearchBooks', () => {
    it('should create an action', () => {
      const payload = 'some book';
      const action = new FindBookPageActions.SearchBooks(payload);

      expect({ ...action }).toEqual({
        type: FindBookPageActions.FindBookPageActionTypes.SearchBooks,
        payload,
      });
    });
  });
});
