import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { cold, hot } from 'jasmine-marbles';
import { Observable } from 'rxjs';

import {
  CollectionApiActions,
  SelectedBookPageActions,
  CollectionPageActions,
} from '@example-app/books/actions';
import { Book } from '@example-app/books/models/book';
import { CollectionEffects } from '@example-app/books/effects/collection.effects';
import {
  IBookStorageService,
  BookStorageService,
  LOCAL_STORAGE_TOKEN,
} from '@example-app/core/services/book-storage.service';

describe('CollectionEffects', () => {
  let db: IBookStorageService;
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
            deleteCollection: jest.fn(),
            addToCollection: jest.fn(),
            getCollection: jest.fn(),
            removeFromCollection: jest.fn(),
          } as IBookStorageService,
        },
        {
          provide: LOCAL_STORAGE_TOKEN,
          useValue: {
            removeItem: jest.fn(),
            setItem: jest.fn(),
            getItem: jest.fn(_ => JSON.stringify([])),
          },
        },
        provideMockActions(() => actions$),
      ],
    });

    db = TestBed.get(BookStorageService);
    effects = TestBed.get(CollectionEffects);
    actions$ = TestBed.get(Actions);
  });
  describe('checkStorageSupport$', () => {
    it('should call db.checkStorageSupport when initially subscribed to', () => {
      effects.checkStorageSupport$.subscribe();
      expect(db.supported).toHaveBeenCalled();
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
      const response = cold('-a|', { a: [book1, book2] });
      const expected = cold('--c', { c: completion });
      db.getCollection = jest.fn(() => response);

      expect(effects.loadCollection$).toBeObservable(expected);
    });

    it('should return a collection.LoadFail, if the query throws', () => {
      const action = new CollectionPageActions.LoadCollection();
      const error = 'Error!';
      const completion = new CollectionApiActions.LoadBooksFailure(error);

      actions$ = hot('-a', { a: action });
      const response = cold('-#', {}, error);
      const expected = cold('--c', { c: completion });
      db.getCollection = jest.fn(() => response);

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
      db.addToCollection = jest.fn(() => response);

      expect(effects.addBookToCollection$).toBeObservable(expected);
      expect(db.addToCollection).toHaveBeenCalledWith([book1]);
    });

    it('should return a collection.AddBookFail, with the book, when the collection insert throws', () => {
      const action = new SelectedBookPageActions.AddBook(book1);
      const completion = new CollectionApiActions.AddBookFailure(book1);
      const error = 'Error!';

      actions$ = hot('-a', { a: action });
      const response = cold('-#', {}, error);
      const expected = cold('--c', { c: completion });
      db.addToCollection = jest.fn(() => response);

      expect(effects.addBookToCollection$).toBeObservable(expected);
    });

    describe('removeBookFromCollection$', () => {
      it('should return a collection.RemoveBookSuccess, with the book, on success', () => {
        const action = new SelectedBookPageActions.RemoveBook(book1);
        const completion = new CollectionApiActions.RemoveBookSuccess(book1);

        actions$ = hot('-a', { a: action });
        const response = cold('-b', { b: true });
        const expected = cold('--c', { c: completion });
        db.removeFromCollection = jest.fn(() => response);

        expect(effects.removeBookFromCollection$).toBeObservable(expected);
        expect(db.removeFromCollection).toHaveBeenCalledWith([book1.id]);
      });

      it('should return a collection.RemoveBookFail, with the book, when the collection remove throws', () => {
        const action = new SelectedBookPageActions.RemoveBook(book1);
        const completion = new CollectionApiActions.RemoveBookFailure(book1);
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
