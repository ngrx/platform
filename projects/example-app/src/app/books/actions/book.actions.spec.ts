import * as BookActions from './book.actions';

describe('Book Actions', () => {
  describe('LoadBook', () => {
    it('should create an action', () => {
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
      const action = new BookActions.LoadBook(payload);

      expect({ ...action }).toEqual({
        type: BookActions.BookActionTypes.LoadBook,
        payload,
      });
    });
  });
});
