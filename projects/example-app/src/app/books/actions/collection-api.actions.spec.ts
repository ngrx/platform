import * as CollectionApiActions from './collection-api.actions';

describe('CollectionApis', () => {
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

  describe('AddBook Actions', () => {
    describe('AddBookSuccess', () => {
      it('should create an action', () => {
        const action = new CollectionApiActions.AddBookSuccess(payload);
        expect({ ...action }).toEqual({
          type: CollectionApiActions.CollectionApiActionTypes.AddBookSuccess,
          payload,
        });
      });
    });

    describe('AddBookFailure', () => {
      it('should create an action', () => {
        const action = new CollectionApiActions.AddBookFailure(payload);

        expect({ ...action }).toEqual({
          type: CollectionApiActions.CollectionApiActionTypes.AddBookFailure,
          payload,
        });
      });
    });
  });

  describe('RemoveBook Actions', () => {
    describe('RemoveBookSuccess', () => {
      it('should create an action', () => {
        const action = new CollectionApiActions.RemoveBookSuccess(payload);
        expect({ ...action }).toEqual({
          type: CollectionApiActions.CollectionApiActionTypes.RemoveBookSuccess,
          payload,
        });
      });
    });

    describe('RemoveBookFailure', () => {
      it('should create an action', () => {
        const action = new CollectionApiActions.RemoveBookFailure(payload);

        expect({ ...action }).toEqual({
          type: CollectionApiActions.CollectionApiActionTypes.RemoveBookFailure,
          payload,
        });
      });
    });
  });

  describe('LoadBooks Actions', () => {
    describe('LoadBooksSuccess', () => {
      it('should create an action', () => {
        const action = new CollectionApiActions.LoadBooksSuccess([payload]);
        expect({ ...action }).toEqual({
          type: CollectionApiActions.CollectionApiActionTypes.LoadBooksSuccess,
          payload: [payload],
        });
      });
    });

    describe('LoadBooksFailure', () => {
      it('should create an action', () => {
        const action = new CollectionApiActions.RemoveBookFailure(payload);

        expect({ ...action }).toEqual({
          type: CollectionApiActions.CollectionApiActionTypes.RemoveBookFailure,
          payload,
        });
      });
    });
  });
});
