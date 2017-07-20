import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { cold, hot, getTestScheduler } from 'jasmine-marbles';
import { empty } from 'rxjs/observable/empty';
import { BookEffects, SEARCH_SCHEDULER, SEARCH_DEBOUNCE } from './book';
import { GoogleBooksService } from '../../core/services/google-books';
import { Observable } from 'rxjs/Observable';
import { SearchAction, SearchCompleteAction } from '../actions/book';
import { Book } from '../models/book';

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

describe('BookEffects', () => {
  let effects: BookEffects;
  let googleBooksService: any;
  let actions$: TestActions;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BookEffects,
        {
          provide: GoogleBooksService,
          useValue: jasmine.createSpyObj('GoogleBooksService', ['searchBooks']),
        },
        { provide: Actions, useFactory: getActions },
        { provide: SEARCH_SCHEDULER, useFactory: getTestScheduler },
        { provide: SEARCH_DEBOUNCE, useValue: 30 },
      ],
    });

    effects = TestBed.get(BookEffects);
    googleBooksService = TestBed.get(GoogleBooksService);
    actions$ = TestBed.get(Actions);
  });

  describe('search$', () => {
    it('should return a new book.SearchCompleteAction, with the books, on success, after the de-bounce', () => {
      const book1 = { id: '111', volumeInfo: {} } as Book;
      const book2 = { id: '222', volumeInfo: {} } as Book;
      const books = [book1, book2];
      const action = new SearchAction('query');
      const completion = new SearchCompleteAction(books);

      actions$.stream = hot('-a---', { a: action });
      const response = cold('-a|', { a: books });
      const expected = cold('-----b', { b: completion });
      googleBooksService.searchBooks.and.returnValue(response);

      expect(effects.search$).toBeObservable(expected);
    });

    it('should return a new book.SearchCompleteAction, with an empty array, if the books service throws', () => {
      const action = new SearchAction('query');
      const completion = new SearchCompleteAction([]);
      const error = 'Error!';

      actions$.stream = hot('-a---', { a: action });
      const response = cold('-#|', {}, error);
      const expected = cold('-----b', { b: completion });
      googleBooksService.searchBooks.and.returnValue(response);

      expect(effects.search$).toBeObservable(expected);
    });

    it(`should not do anything if the query is an empty string`, () => {
      const action = new SearchAction('');

      actions$.stream = hot('-a---', { a: action });
      const expected = cold('---');

      expect(effects.search$).toBeObservable(expected);
    });
  });
});
