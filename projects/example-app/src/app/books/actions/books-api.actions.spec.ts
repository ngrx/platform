import * as BooksApiActions from './books-api.actions';

describe('BooksApiActions Actions', () => {
  describe('SearchSuccess', () => {
    it('should create an action', () => {
      const payload = [
        {
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
        },
      ];
      const action = new BooksApiActions.SearchSuccess(payload);

      expect({ ...action }).toEqual({
        type: BooksApiActions.BooksApiActionTypes.SearchSuccess,
        payload,
      });
    });
  });

  describe('SearchSuccess', () => {
    it('should create an action', () => {
      const payload = 'some error';
      const action = new BooksApiActions.SearchFailure(payload);

      expect({ ...action }).toEqual({
        type: BooksApiActions.BooksApiActionTypes.SearchFailure,
        payload,
      });
    });
  });
});
