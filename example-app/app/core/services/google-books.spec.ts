import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { cold } from 'jasmine-marbles';
import { GoogleBooksService } from './google-books';

describe('Service: GoogleBooks', () => {
  let service: GoogleBooksService;
  let http: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: HttpClient, useValue: { get: jest.fn() } },
        GoogleBooksService,
      ],
    });

    service = TestBed.get(GoogleBooksService);
    http = TestBed.get(HttpClient);
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
    const response = cold('-a|', { a: books });
    const expected = cold('-b|', { b: books.items });
    http.get = jest.fn(() => response);

    expect(service.searchBooks(queryTitle)).toBeObservable(expected);
    expect(http.get).toHaveBeenCalledWith(
      `https://www.googleapis.com/books/v1/volumes?q=${queryTitle}`
    );
  });

  it('should retrieve the book from the volumeId', () => {
    const response = cold('-a|', { a: data });
    const expected = cold('-b|', { b: data });
    http.get = jest.fn(() => response);

    expect(service.retrieveBook(data.volumeId)).toBeObservable(expected);
    expect(http.get).toHaveBeenCalledWith(
      `https://www.googleapis.com/books/v1/volumes/${data.volumeId}`
    );
  });
});
