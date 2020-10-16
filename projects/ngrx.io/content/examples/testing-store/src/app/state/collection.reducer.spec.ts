import * as fromReducer from './collection.reducer';
import { addBook, removeBook } from './books.actions';

describe('CollectionReducer', () => {
  describe('unknown action', () => {
    it('should return the previous state', () => {
      const { initialState } = fromReducer;
      const action = {
        type: 'Unknown',
      };
      const state = fromReducer.collectionReducer(initialState, action);

      expect(state).toBe(initialState);
    });
  });

  describe('add action', () => {
    it('should add an item from the book list and update the state in an immutable way', () => {
      const initialState: Array<string> = ['firstId', 'secondId'];

      const action = addBook({ bookId: 'thirdId' });
      const state = fromReducer.collectionReducer(initialState, action);

      expect(state[2]).toBe('thirdId');
    });

    it('should not add a bookId to collection when that bookId is already in the collection', () => {
      const initialState: Array<string> = ['firstId', 'secondId'];

      const action = addBook({ bookId: 'secondId' });
      const state = fromReducer.collectionReducer(initialState, action);

      expect(state[2]).toEqual(undefined);
      expect(state[1]).toBe('secondId');
    });
  });

  describe('remove action', () => {
    it('should remove the selected book from the collection update the state in an immutable way', () => {
      const initialState: Array<string> = ['firstId', 'secondId'];
      const action = removeBook({ bookId: 'secondId' });
      const state = fromReducer.collectionReducer(initialState, action);

      expect(state[1]).toEqual(undefined);
    });
  });
});
