import { selectBooks, selectCollectionIds, selectBookCollection } from './allBooks.selectors';
import { AppState } from './state';

describe('Selectors', () => {
  const initialState: AppState = {
    books: [
      {
        id: 'abc123',
        volumeInfo: {
          title: 'First Title',
          authors: ['First Author']
        }
      },
      {
        id: 'xyz789',
        volumeInfo: {
          title: 'Second Title',
          authors: ['Second Author']
        }
      },
    ],
    collection: ['abc123']
  }

  it('should select the book list', () => {
    const result = selectBooks.projector(initialState.books);
    expect(result.length).toEqual(2);
    expect(result[1].id).toEqual('xyz789');
  });

  it('should select the book collection', () => {
    const result = selectBookCollection.projector(initialState.books, initialState.collection);
    expect(result.length).toEqual(1);
    expect(result[0].id).toEqual('abc123');
  });

});