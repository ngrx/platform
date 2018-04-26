import { TestBed } from '@angular/core/testing';
import { Database } from '@ngrx/db';
import { Actions } from '@ngrx/effects';
import { cold, hot } from 'jasmine-marbles';
import { empty, Observable } from 'rxjs';

import * as CollectionActions from '../actions/collection.actions';
import { Book } from '../models/book';
import { CollectionEffects } from './collection.effects';

export class TestActions extends Actions {
  constructor() {
    super(empty());
  }

  set stream(source: Observable<any>) {
    this.source = source;
  }
}

export function getActions() {
  return new TestActions();
}

describe('CollectionEffects', () => {
  let db: any;
  let effects: CollectionEffects;
  let actions$: TestActions;

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
        { provide: Actions, useFactory: getActions },
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
      const action = new CollectionActions.Load();
      const completion = new CollectionActions.LoadSuccess([book1, book2]);

      actions$.stream = hot('-a', { a: action });
      const response = cold('-a-b|', { a: book1, b: book2 });
      const expected = cold('-----c', { c: completion });
      db.query = jest.fn(() => response);

      expect(effects.loadCollection$).toBeObservable(expected);
    });

    it('should return a collection.LoadFail, if the query throws', () => {
      const action = new CollectionActions.Load();
      const error = 'Error!';
      const completion = new CollectionActions.LoadFail(error);

      actions$.stream = hot('-a', { a: action });
      const response = cold('-#', {}, error);
      const expected = cold('--c', { c: completion });
      db.query = jest.fn(() => response);

      expect(effects.loadCollection$).toBeObservable(expected);
    });
  });

  describe('addBookToCollection$', () => {
    it('should return a collection.AddBookSuccess, with the book, on success', () => {
      const action = new CollectionActions.AddBook(book1);
      const completion = new CollectionActions.AddBookSuccess(book1);

      actions$.stream = hot('-a', { a: action });
      const response = cold('-b', { b: true });
      const expected = cold('--c', { c: completion });
      db.insert = jest.fn(() => response);

      expect(effects.addBookToCollection$).toBeObservable(expected);
      expect(db.insert).toHaveBeenCalledWith('books', [book1]);
    });

    it('should return a collection.AddBookFail, with the book, when the db insert throws', () => {
      const action = new CollectionActions.AddBook(book1);
      const completion = new CollectionActions.AddBookFail(book1);
      const error = 'Error!';

      actions$.stream = hot('-a', { a: action });
      const response = cold('-#', {}, error);
      const expected = cold('--c', { c: completion });
      db.insert = jest.fn(() => response);

      expect(effects.addBookToCollection$).toBeObservable(expected);
    });

    describe('removeBookFromCollection$', () => {
      it('should return a collection.RemoveBookSuccess, with the book, on success', () => {
        const action = new CollectionActions.RemoveBook(book1);
        const completion = new CollectionActions.RemoveBookSuccess(book1);

        actions$.stream = hot('-a', { a: action });
        const response = cold('-b', { b: true });
        const expected = cold('--c', { c: completion });
        db.executeWrite = jest.fn(() => response);

        expect(effects.removeBookFromCollection$).toBeObservable(expected);
        expect(db.executeWrite).toHaveBeenCalledWith('books', 'delete', [
          book1.id,
        ]);
      });

      it('should return a collection.RemoveBookFail, with the book, when the db insert throws', () => {
        const action = new CollectionActions.RemoveBook(book1);
        const completion = new CollectionActions.RemoveBookFail(book1);
        const error = 'Error!';

        actions$.stream = hot('-a', { a: action });
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
