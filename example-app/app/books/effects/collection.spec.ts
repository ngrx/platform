import { Actions } from '@ngrx/effects';
import { TestBed } from '@angular/core/testing';
import { empty } from 'rxjs/observable/empty';
import { cold, hot } from 'jasmine-marbles';
import { CollectionEffects } from './collection';
import { Database } from '@ngrx/db';
import { Book } from '../models/book';
import * as collection from '../actions/collection';
import { Observable } from 'rxjs/Observable';

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
          useValue: jasmine.createSpyObj('database', [
            'open',
            'query',
            'insert',
            'executeWrite',
          ]),
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
      const action = new collection.Load();
      const completion = new collection.LoadSuccess([book1, book2]);

      actions$.stream = hot('-a', { a: action });
      const response = cold('-a-b|', { a: book1, b: book2 });
      const expected = cold('-----c', { c: completion });
      db.query.and.returnValue(response);

      expect(effects.loadCollection$).toBeObservable(expected);
    });

    it('should return a collection.LoadFail, if the query throws', () => {
      const action = new collection.Load();
      const error = 'Error!';
      const completion = new collection.LoadFail(error);

      actions$.stream = hot('-a', { a: action });
      const response = cold('-#', {}, error);
      const expected = cold('--c', { c: completion });
      db.query.and.returnValue(response);

      expect(effects.loadCollection$).toBeObservable(expected);
    });
  });

  describe('addBookToCollection$', () => {
    it('should return a collection.AddBookSuccess, with the book, on success', () => {
      const action = new collection.AddBook(book1);
      const completion = new collection.AddBookSuccess(book1);

      actions$.stream = hot('-a', { a: action });
      const response = cold('-b', { b: true });
      const expected = cold('--c', { c: completion });
      db.insert.and.returnValue(response);

      expect(effects.addBookToCollection$).toBeObservable(expected);
      expect(db.insert).toHaveBeenCalledWith('books', [book1]);
    });

    it('should return a collection.AddBookFail, with the book, when the db insert throws', () => {
      const action = new collection.AddBook(book1);
      const completion = new collection.AddBookFail(book1);
      const error = 'Error!';

      actions$.stream = hot('-a', { a: action });
      const response = cold('-#', {}, error);
      const expected = cold('--c', { c: completion });
      db.insert.and.returnValue(response);

      expect(effects.addBookToCollection$).toBeObservable(expected);
    });

    describe('removeBookFromCollection$', () => {
      it('should return a collection.RemoveBookSuccess, with the book, on success', () => {
        const action = new collection.RemoveBook(book1);
        const completion = new collection.RemoveBookSuccess(book1);

        actions$.stream = hot('-a', { a: action });
        const response = cold('-b', { b: true });
        const expected = cold('--c', { c: completion });
        db.executeWrite.and.returnValue(response);

        expect(effects.removeBookFromCollection$).toBeObservable(expected);
        expect(db.executeWrite).toHaveBeenCalledWith('books', 'delete', [
          book1.id,
        ]);
      });

      it('should return a collection.RemoveBookFail, with the book, when the db insert throws', () => {
        const action = new collection.RemoveBook(book1);
        const completion = new collection.RemoveBookFail(book1);
        const error = 'Error!';

        actions$.stream = hot('-a', { a: action });
        const response = cold('-#', {}, error);
        const expected = cold('--c', { c: completion });
        db.executeWrite.and.returnValue(response);

        expect(effects.removeBookFromCollection$).toBeObservable(expected);
        expect(db.executeWrite).toHaveBeenCalledWith('books', 'delete', [
          book1.id,
        ]);
      });
    });
  });
});
