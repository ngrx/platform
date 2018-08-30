import { TestBed } from '@angular/core/testing';
import { Database } from '@ngrx/db';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { cold, hot } from 'jasmine-marbles';
import { empty, Observable } from 'rxjs';

import * as CollectionApiActions from '@example-app/books/actions/collection-api.actions';
import * as SelectedBookPageActions from '@example-app/books/actions/selected-book-page.actions';
import * as CollectionPageActions from '@example-app/books/actions/collection-page.actions';
import { Book } from '@example-app/books/models/book';
import { CollectionEffects } from '@example-app/books/effects/collection.effects';

describe('CollectionEffects', () => {
  let db: any;
  let effects: CollectionEffects;
  let actions$: Observable<any>;

  const book1 = { id: '111', volumeInfo: {} } as Book;
  const book2 = { id: '222', volumeInfo: {} } as Book;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CollectionEffects,
        {
          provide: Database,
          useValue: {
            open: jest.fn(),
            query: jest.fn(),
            insert: jest.fn(),
            executeWrite: jest.fn(),
          },
        },
        provideMockActions(() => actions$),
      ],
    });

    db = TestBed.get(Database);
    effects = TestBed.get(CollectionEffects);
    actions$ = TestBed.get(Actions);
  });

  describe('openDB$', () => {
    it('should call db.open when initially subscribed to', () => {
      effects.openDB$.subscribe();
      expect(db.open).toHaveBeenCalledWith('books_app');
    });
  });

  describe('loadCollection$', () => {
    it('should return a collection.LoadSuccess, with the books, on success', () => {
      const action = new CollectionPageActions.LoadCollection();
      const completion = new CollectionApiActions.LoadBooksSuccess([
        book1,
        book2,
      ]);

      actions$ = hot('-a', { a: action });
      const response = cold('-a-b|', { a: book1, b: book2 });
      const expected = cold('-----c', { c: completion });
      db.query = jest.fn(() => response);

      expect(effects.loadCollection$).toBeObservable(expected);
    });

    it('should return a collection.LoadFail, if the query throws', () => {
      const action = new CollectionPageActions.LoadCollection();
      const error = 'Error!';
      const completion = new CollectionApiActions.LoadBooksFailure(error);

      actions$ = hot('-a', { a: action });
      const response = cold('-#', {}, error);
      const expected = cold('--c', { c: completion });
      db.query = jest.fn(() => response);

      expect(effects.loadCollection$).toBeObservable(expected);
    });
  });

  describe('addBookToCollection$', () => {
    it('should return a collection.AddBookSuccess, with the book, on success', () => {
      const action = new SelectedBookPageActions.AddBook(book1);
      const completion = new CollectionApiActions.AddBookSuccess(book1);

      actions$ = hot('-a', { a: action });
      const response = cold('-b', { b: true });
      const expected = cold('--c', { c: completion });
      db.insert = jest.fn(() => response);

      expect(effects.addBookToCollection$).toBeObservable(expected);
      expect(db.insert).toHaveBeenCalledWith('books', [book1]);
    });

    it('should return a collection.AddBookFail, with the book, when the db insert throws', () => {
      const action = new SelectedBookPageActions.AddBook(book1);
      const completion = new CollectionApiActions.AddBookFailure(book1);
      const error = 'Error!';

      actions$ = hot('-a', { a: action });
      const response = cold('-#', {}, error);
      const expected = cold('--c', { c: completion });
      db.insert = jest.fn(() => response);

      expect(effects.addBookToCollection$).toBeObservable(expected);
    });

    describe('removeBookFromCollection$', () => {
      it('should return a collection.RemoveBookSuccess, with the book, on success', () => {
        const action = new SelectedBookPageActions.RemoveBook(book1);
        const completion = new CollectionApiActions.RemoveBookSuccess(book1);

        actions$ = hot('-a', { a: action });
        const response = cold('-b', { b: true });
        const expected = cold('--c', { c: completion });
        db.executeWrite = jest.fn(() => response);

        expect(effects.removeBookFromCollection$).toBeObservable(expected);
        expect(db.executeWrite).toHaveBeenCalledWith('books', 'delete', [
          book1.id,
        ]);
      });

      it('should return a collection.RemoveBookFail, with the book, when the db insert throws', () => {
        const action = new SelectedBookPageActions.RemoveBook(book1);
        const completion = new CollectionApiActions.RemoveBookFailure(book1);
        const error = 'Error!';

        actions$ = hot('-a', { a: action });
        const response = cold('-#', {}, error);
        const expected = cold('--c', { c: completion });
        db.executeWrite = jest.fn(() => response);

        expect(effects.removeBookFromCollection$).toBeObservable(expected);
        expect(db.executeWrite).toHaveBeenCalledWith('books', 'delete', [
          book1.id,
        ]);
      });
    });
  });
});
