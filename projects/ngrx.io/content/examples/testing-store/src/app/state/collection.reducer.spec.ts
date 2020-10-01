import * as fromReducer from './collection.reducer';
import { addBook, removeBook } from './allBooks.actions';
import { Book } from '../book-list/books.service';
import { AppState } from './state';

describe('CollectionReducer', () => {
  describe('unknown action', () => {
    it('should return the default state', () => {
      const { initialState } = fromReducer;
      const action = {
        type: 'Unknown'
      };
      const state = fromReducer.collectionReducer(initialState, action);

      expect(state).toBe(initialState);
    });
  });

  describe('add action', () => {
    it('should add an item from the book list and update the state in an immutable way', () => {
      const initialState: Array<string> = ['abc123'];

      const action = addBook({ bookId: 'jk45'});
      const state = fromReducer.collectionReducer(initialState, action);

      expect(state[1]).toBe('jk45');
    });

    it('should not add a bookId to collection when that bookId is already in the collection', () => {
      const initialState: Array<string> = ['abc123', 'jk45'];

      const action = addBook({ bookId: 'jk45' });
      const state = fromReducer.collectionReducer(initialState, action);

      expect(state[2]).toEqual(undefined);
      expect(state[1]).toBe('jk45');
    });
  });

  describe('remove action', () => {
    it('should remove the selected book from the collection update the state in an immutable way', () => {
      const initialState: Array<string> = ['abc123', 'jk45'];
      const action = removeBook({ bookId: 'jk45' });
      const state = fromReducer.collectionReducer(initialState, action);

      expect(state[1]).toEqual(undefined);
    });
  });
});