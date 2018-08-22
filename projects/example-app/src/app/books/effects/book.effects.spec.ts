import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { cold, getTestScheduler, hot } from 'jasmine-marbles';
import { empty, Observable } from 'rxjs';

import { GoogleBooksService } from '../../core/services/google-books.service';
import { Search, SearchComplete, SearchError } from '../actions/book.actions';
import { Book } from '../models/book';
import { BookEffects } from './book.effects';

describe('BookEffects', () => {
  let effects: BookEffects;
  let googleBooksService: any;
  let actions$: Observable<any>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BookEffects,
        {
          provide: GoogleBooksService,
          useValue: { searchBooks: jest.fn() },
        },
        provideMockActions(() => actions$),
      ],
    });

    effects = TestBed.get(BookEffects);
    googleBooksService = TestBed.get(GoogleBooksService);
    actions$ = TestBed.get(Actions);
  });

  describe('search$', () => {
    it('should return a new book.SearchComplete, with the books, on success, after the de-bounce', () => {
      const book1 = { id: '111', volumeInfo: {} } as Book;
      const book2 = { id: '222', volumeInfo: {} } as Book;
      const books = [book1, book2];
      const action = new Search('query');
      const completion = new SearchComplete(books);

      actions$ = hot('-a---', { a: action });
      const response = cold('-a|', { a: books });
      const expected = cold('-----b', { b: completion });
      googleBooksService.searchBooks = jest.fn(() => response);

      expect(
        effects.search$({
          debounce: 30,
          scheduler: getTestScheduler(),
        })
      ).toBeObservable(expected);
    });

    it('should return a new book.SearchError if the books service throws', () => {
      const action = new Search('query');
      const completion = new SearchError('Unexpected Error. Try again later.');
      const error = 'Unexpected Error. Try again later.';

      actions$ = hot('-a---', { a: action });
      const response = cold('-#|', {}, error);
      const expected = cold('-----b', { b: completion });
      googleBooksService.searchBooks = jest.fn(() => response);

      expect(
        effects.search$({
          debounce: 30,
          scheduler: getTestScheduler(),
        })
      ).toBeObservable(expected);
    });

    it(`should not do anything if the query is an empty string`, () => {
      const action = new Search('');

      actions$ = hot('-a---', { a: action });
      const expected = cold('---');

      expect(
        effects.search$({
          debounce: 30,
          scheduler: getTestScheduler(),
        })
      ).toBeObservable(expected);
    });
  });
});
