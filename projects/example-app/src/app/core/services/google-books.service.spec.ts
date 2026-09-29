import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';

import { cold } from '../../testing/marbles';

import { generateMockBook, type Book } from '@example-app/books/models';
import { GoogleBooksService } from './google-books.service';

function createBook(id: string, title: string): Book {
  const book = generateMockBook();

  return {
    ...book,
    id,
    volumeInfo: { ...book.volumeInfo, title },
  };
}

describe('Service: GoogleBooks', () => {
  let service: GoogleBooksService;
  let http: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: HttpClient, useValue: { get: vi.fn() } }],
    });

    service = TestBed.inject(GoogleBooksService);
    http = TestBed.inject(HttpClient);
  });

  const data = createBook('12345', 'Book Title');

  const books = {
    items: [createBook('12345', 'Title'), createBook('67890', 'Another Title')],
  };

  const queryTitle = 'Book Title';

  it('should call the search api and return the search results', () => {
    const response = cold('-a|', { a: books });
    const expected = cold('-b|', { b: books.items });
    http.get = vi.fn(() => response) as unknown as typeof http.get;

    expect(service.searchBooks(queryTitle)).toBeObservable(expected);
    expect(http.get).toHaveBeenCalledWith(
      `https://www.googleapis.com/books/v1/volumes?orderBy=newest&q=${queryTitle}`
    );
  });

  it('should retrieve the book from the volumeId', () => {
    const response = cold('-a|', { a: data });
    const expected = cold('-b|', { b: data });
    http.get = vi.fn(() => response) as unknown as typeof http.get;

    expect(service.retrieveBook(data.id)).toBeObservable(expected);
    expect(http.get).toHaveBeenCalledWith(
      `https://www.googleapis.com/books/v1/volumes/${data.id}`
    );
  });
});
