import { TestBed } from '@angular/core/testing';

import {
  CollectionApiActions,
  CollectionPageActions,
  SelectedBookPageActions,
} from '@example-app/books/actions';
import { CollectionEffects } from '@example-app/books/effects';
import { Book } from '@example-app/books/models';
import {
  BookStorageService,
  LOCAL_STORAGE_TOKEN,
} from '@example-app/core/services';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { cold, hot } from 'jasmine-marbles';
import { Observable } from 'rxjs';

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
          provide: BookStorageService,
          useValue: {
            supported: jest.fn(),
            deleteStoredCollection: jest.fn(),
            addToCollection: jest.fn(),
            getCollection: jest.fn(),
            removeFromCollection: jest.fn(),
          },
        },
        {
          provide: LOCAL_STORAGE_TOKEN,
          useValue: {
            removeItem: jest.fn(),
            setItem: jest.fn(),
            getItem: jest.fn((_) => JSON.stringify([])),
          },
        },
        provideMockActions(() => actions$),
      ],
    });

    db = TestBed.inject(BookStorageService);
    effects = TestBed.inject(CollectionEffects);
    actions$ = TestBed.inject(Actions);
  });
  describe('checkStorageSupport$', () => {
    it('should call db.checkStorageSupport when initially subscribed to', () => {
      effects.checkStorageSupport$.subscribe();
      expect(db.supported).toHaveBeenCalled();
    });
  });
  describe('loadCollection$', () => {
    it('should return a collection.LoadSuccess, with the books, on success', () => {
      const action = CollectionPageActions.enter();
      const completion = CollectionApiActions.loadBooksSuccess({
        books: [book1, book2],
      });

      actions$ = hot('-a', { a: action });
      const response = cold('-a|', { a: [book1, book2] });
      const expected = cold('--c', { c: completion });
      db.getCollection = jest.fn(() => response);

      expect(effects.loadCollection$).toBeObservable(expected);
    });

    it('should return a collection.LoadFail, if the query throws', () => {
      const action = CollectionPageActions.enter();
      const error = 'Error!';
      const completion = CollectionApiActions.loadBooksFailure({ error });

      actions$ = hot('-a', { a: action });
      const response = cold('-#', {}, error);
      const expected = cold('--c', { c: completion });
      db.getCollection = jest.fn(() => response);

      expect(effects.loadCollection$).toBeObservable(expected);
    });
  });

  describe('addBookToCollection$', () => {
    it('should return a collection.AddBookSuccess, with the book, on success', () => {
      const action = SelectedBookPageActions.addBook({ book: book1 });
      const completion = CollectionApiActions.addBookSuccess({ book: book1 });

      actions$ = hot('-a', { a: action });
      const response = cold('-b', { b: true });
      const expected = cold('--c', { c: completion });
      db.addToCollection = jest.fn(() => response);

      expect(effects.addBookToCollection$).toBeObservable(expected);
      expect(db.addToCollection).toHaveBeenCalledWith([book1]);
    });

    it('should return a collection.AddBookFail, with the book, when the db insert throws', () => {
      const action = SelectedBookPageActions.addBook({ book: book1 });
      const completion = CollectionApiActions.addBookFailure({ book: book1 });
      const error = 'Error!';

      actions$ = hot('-a', { a: action });
      const response = cold('-#', {}, error);
      const expected = cold('--c', { c: completion });
      db.addToCollection = jest.fn(() => response);

      expect(effects.addBookToCollection$).toBeObservable(expected);
    });

    describe('removeBookFromCollection$', () => {
      it('should return a collection.RemoveBookSuccess, with the book, on success', () => {
        const action = SelectedBookPageActions.removeBook({ book: book1 });
        const completion = CollectionApiActions.removeBookSuccess({
          book: book1,
        });

        actions$ = hot('-a', { a: action });
        const response = cold('-b', { b: true });
        const expected = cold('--c', { c: completion });
        db.removeFromCollection = jest.fn(() => response);

        expect(effects.removeBookFromCollection$).toBeObservable(expected);
        expect(db.removeFromCollection).toHaveBeenCalledWith([book1.id]);
      });

      it('should return a collection.RemoveBookFail, with the book, when the db insert throws', () => {
        const action = SelectedBookPageActions.removeBook({ book: book1 });
        const completion = CollectionApiActions.removeBookFailure({
          book: book1,
        });
        const error = 'Error!';

        actions$ = hot('-a', { a: action });
        const response = cold('-#', {}, error);
        const expected = cold('--c', { c: completion });
        db.removeFromCollection = jest.fn(() => response);

        expect(effects.removeBookFromCollection$).toBeObservable(expected);
        expect(db.removeFromCollection).toHaveBeenCalledWith([book1.id]);
      });
    });
  });
});
