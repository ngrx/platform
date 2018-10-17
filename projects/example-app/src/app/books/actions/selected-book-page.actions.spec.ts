import * as SelectedBookPageActions from './selected-book-page.actions';

describe('SelectedBookPageActions Actions', () => {
  const payload = {
    id: 'string',
    volumeInfo: {
      title: 'string',
      subtitle: 'string',
      authors: ['string'],
      publisher: 'string',
      publishDate: 'string',
      description: 'string',
      averageRating: 1,
      ratingsCount: 2,
      imageLinks: {
        thumbnail: 'string',
        smallThumbnail: 'string',
      },
    },
  };

  describe('AddBook', () => {
    it('should create an action', () => {
      const action = new SelectedBookPageActions.AddBook(payload);
      expect({ ...action }).toEqual({
        type: SelectedBookPageActions.SelectedBookPageActionTypes.AddBook,
        payload,
      });
    });
  });

  describe('LoadToppingsFail', () => {
    it('should create an action', () => {
      const action = new SelectedBookPageActions.RemoveBook(payload);

      expect({ ...action }).toEqual({
        type: SelectedBookPageActions.SelectedBookPageActionTypes.RemoveBook,
        payload,
      });
    });
  });
});
