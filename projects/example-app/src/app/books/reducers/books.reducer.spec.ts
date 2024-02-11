import { reducer } from '@example-app/books/reducers/books.reducer';
import * as fromBooks from '@example-app/books/reducers/books.reducer';
import { booksApiActions } from '@example-app/books/actions/books-api.actions';
import { bookActions } from '@example-app/books/actions/book.actions';
import { collectionApiActions } from '@example-app/books/actions/collection-api.actions';
import { viewBookPageActions } from '@example-app/books/actions/view-book-page.actions';
import { Book, generateMockBook } from '@example-app/books/models';

describe('BooksReducer', () => {
  const book1 = generateMockBook();
  const book2 = { ...book1, id: '222' };
  const book3 = { ...book1, id: '333' };
  const initialState: fromBooks.State = {
    ids: [book1.id, book2.id],
    entities: {
      [book1.id]: book1,
      [book2.id]: book2,
    },
    selectedBookId: null,
  };

  describe('undefined action', () => {
    it('should return the default state', () => {
      const result = reducer(undefined, {} as any);

      expect(result).toMatchSnapshot();
    });
  });

  describe('SEARCH_COMPLETE & LOAD_SUCCESS', () => {
    type BooksActions =
      | typeof booksApiActions.searchSuccess
      | typeof collectionApiActions.loadBooksSuccess;
    function noExistingBooks(
      action: BooksActions,
      booksInitialState: any,
      books: Book[]
    ) {
      const createAction = action({ books });

      const result = reducer(booksInitialState, createAction);

      expect(result).toMatchSnapshot();
    }

    function existingBooks(
      action: BooksActions,
      booksInitialState: any,
      books: Book[]
    ) {
      // should not replace existing books
      const differentBook2 = { ...books[0], foo: 'bar' };
      const createAction = action({ books: [books[1], differentBook2] });

      const result = reducer(booksInitialState, createAction);

      expect(result).toMatchSnapshot();
    }

    it('should add all books in the payload when none exist', () => {
      noExistingBooks(booksApiActions.searchSuccess, initialState, [
        book1,
        book2,
      ]);

      noExistingBooks(collectionApiActions.loadBooksSuccess, initialState, [
        book1,
        book2,
      ]);
    });

    it('should add only books when books already exist', () => {
      existingBooks(booksApiActions.searchSuccess, initialState, [
        book2,
        book3,
      ]);

      existingBooks(collectionApiActions.loadBooksSuccess, initialState, [
        book2,
        book3,
      ]);
    });
  });

  describe('LOAD', () => {
    const expectedResult = {
      ids: [book1.id],
      entities: {
        [book1.id]: book1,
      },
      selectedBookId: null,
    };

    it('should add a single book, if the book does not exist', () => {
      const action = bookActions.loadBook({ book: book1 });

      const result = reducer(fromBooks.initialState, action);

      expect(result).toMatchSnapshot();
    });

    it('should return the existing state if the book exists', () => {
      const action = bookActions.loadBook({ book: book1 });

      const result = reducer(expectedResult, action);

      expect(result).toMatchSnapshot();
    });
  });

  describe('SELECT', () => {
    it('should set the selected book id on the state', () => {
      const action = viewBookPageActions.selectBook({ id: book1.id });

      const result = reducer(initialState, action);

      expect(result).toMatchSnapshot();
    });
  });

  describe('Selectors', () => {
    describe('selectId', () => {
      it('should return the selected id', () => {
        const result = fromBooks.selectId({
          ...initialState,
          selectedBookId: book1.id,
        });

        expect(result).toMatchSnapshot();
      });
    });
  });
});
