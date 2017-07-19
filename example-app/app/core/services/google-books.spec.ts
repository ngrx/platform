import { TestBed } from '@angular/core/testing';
import { Http } from '@angular/http';
import { cold } from 'jasmine-marbles';
import { GoogleBooksService } from './google-books';

describe('Service: GoogleBooks', () => {
  let service: GoogleBooksService;
  let http: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: Http, useValue: jasmine.createSpyObj('Http', ['get']) },
        GoogleBooksService,
      ],
    });

    service = TestBed.get(GoogleBooksService);
    http = TestBed.get(Http);
  });

  const data = {
    title: 'Book Title',
    author: 'John Smith',
    volumeId: '12345',
  };

  const books = {
    items: [
      { id: '12345', volumeInfo: { title: 'Title' } },
      { id: '67890', volumeInfo: { title: 'Another Title' } },
    ],
  };

  const queryTitle = 'Book Title';

  it('should call the search api and return the search results', () => {
    const httpResponse = {
      json: () => books,
    };

    const response = cold('-a|', { a: httpResponse });
    const expected = cold('-b|', { b: books.items });
    http.get.and.returnValue(response);

    expect(service.searchBooks(queryTitle)).toBeObservable(expected);
    expect(http.get).toHaveBeenCalledWith(
      `https://www.googleapis.com/books/v1/volumes?q=${queryTitle}`
    );
  });

  it('should retrieve the book from the volumeId', () => {
    const httpResponse = {
      json: () => data,
    };

    const response = cold('-a|', { a: httpResponse });
    const expected = cold('-b|', { b: data });
    http.get.and.returnValue(response);

    expect(service.retrieveBook(data.volumeId)).toBeObservable(expected);
    expect(http.get).toHaveBeenCalledWith(
      `https://www.googleapis.com/books/v1/volumes/${data.volumeId}`
    );
  });
});
