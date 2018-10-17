import * as CollectionPageActions from './collection-page.actions';

describe('CollectionPage Actions', () => {
  describe('LoadCollection', () => {
    it('should create an action', () => {
      const action = new CollectionPageActions.LoadCollection();
      expect({ ...action }).toEqual({
        type: CollectionPageActions.CollectionPageActionTypes.LoadCollection,
      });
    });
  });
});
