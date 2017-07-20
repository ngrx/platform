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
    it('should return a collection.LoadSuccessAction, with the books, on success', () => {
      const action = new collection.LoadAction();
      const completion = new collection.LoadSuccessAction([book1, book2]);

      actions$.stream = hot('-a', { a: action });
      const response = cold('-a-b|', { a: book1, b: book2 });
      const expected = cold('-----c', { c: completion });
      db.query.and.returnValue(response);

      expect(effects.loadCollection$).toBeObservable(expected);
    });

    it('should return a collection.LoadFailAction, if the query throws', () => {
      const action = new collection.LoadAction();
      const error = 'Error!';
      const completion = new collection.LoadFailAction(error);

      actions$.stream = hot('-a', { a: action });
      const response = cold('-#', {}, error);
      const expected = cold('--c', { c: completion });
      db.query.and.returnValue(response);

      expect(effects.loadCollection$).toBeObservable(expected);
    });
  });

  describe('addBookToCollection$', () => {
    it('should return a collection.AddBookSuccessAction, with the book, on success', () => {
      const action = new collection.AddBookAction(book1);
      const completion = new collection.AddBookSuccessAction(book1);

      actions$.stream = hot('-a', { a: action });
      const response = cold('-b', { b: true });
      const expected = cold('--c', { c: completion });
      db.insert.and.returnValue(response);

      expect(effects.addBookToCollection$).toBeObservable(expected);
      expect(db.insert).toHaveBeenCalledWith('books', [book1]);
    });

    it('should return a collection.AddBookFailAction, with the book, when the db insert throws', () => {
      const action = new collection.AddBookAction(book1);
      const completion = new collection.AddBookFailAction(book1);
      const error = 'Error!';

      actions$.stream = hot('-a', { a: action });
      const response = cold('-#', {}, error);
      const expected = cold('--c', { c: completion });
      db.insert.and.returnValue(response);

      expect(effects.addBookToCollection$).toBeObservable(expected);
    });

    describe('removeBookFromCollection$', () => {
      it('should return a collection.RemoveBookSuccessAction, with the book, on success', () => {
        const action = new collection.RemoveBookAction(book1);
        const completion = new collection.RemoveBookSuccessAction(book1);

        actions$.stream = hot('-a', { a: action });
        const response = cold('-b', { b: true });
        const expected = cold('--c', { c: completion });
        db.executeWrite.and.returnValue(response);

        expect(effects.removeBookFromCollection$).toBeObservable(expected);
        expect(db.executeWrite).toHaveBeenCalledWith('books', 'delete', [
          book1.id,
        ]);
      });

      it('should return a collection.RemoveBookFailAction, with the book, when the db insert throws', () => {
        const action = new collection.RemoveBookAction(book1);
        const completion = new collection.RemoveBookFailAction(book1);
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
