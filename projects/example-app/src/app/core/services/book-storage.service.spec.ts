import { TestBed } from '@angular/core/testing';

import { cold } from 'jasmine-marbles';

import { Book } from '@example-app/books/models';
import {
  BookStorageService,
  LOCAL_STORAGE_TOKEN,
} from '@example-app/core/services/book-storage.service';

describe('BookStorageService', () => {
  let fixture: any;

  const localStorageFake: Storage & any = {
    removeItem: jest.fn(),
    setItem: jest.fn(),
    getItem: jest.fn((_) => JSON.stringify(persistedCollection)),
  };

  const book1 = { id: '111', volumeInfo: {} } as Book;
  const book2 = { id: '222', volumeInfo: {} } as Book;
  const book3 = { id: '333', volumeInfo: {} } as Book;
  const book4 = { id: '444', volumeInfo: {} } as Book;

  const persistedStorageKey = 'books-app';
  const persistedCollection = [book2, book4];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: LOCAL_STORAGE_TOKEN,
          useValue: localStorageFake,
        },
      ],
    });
    fixture = TestBed.inject(BookStorageService);
  });

  describe('supported', () => {
    it('should have truthy value if localStorage provider set', () => {
      const expected = cold('(-a|)', { a: true });
      expect(fixture.supported()).toBeObservable(expected);
    });

    it('should throw error if localStorage provider  not available', () => {
      TestBed.resetTestingModule().configureTestingModule({
        providers: [
          {
            provide: LOCAL_STORAGE_TOKEN,
            useValue: null,
          },
        ],
      });

      fixture = TestBed.inject(BookStorageService);
      const expected = cold('#', {}, 'Local Storage Not Supported');
      expect(fixture.supported()).toBeObservable(expected);
    });
  });

  describe('getCollection', () => {
    it('should call get collection', () => {
      const expected = cold('(-a|)', { a: persistedCollection });
      expect(fixture.getCollection()).toBeObservable(expected);
      expect(localStorageFake.getItem).toHaveBeenCalledWith(
        persistedStorageKey
      );
      localStorageFake.getItem.mockClear();
    });
  });

  describe('addToCollection', () => {
    it('should add single item', () => {
      const result = [...persistedCollection, book1];
      const expected = cold('(-a|)', { a: result });
      expect(fixture.addToCollection([book1])).toBeObservable(expected);
      expect(localStorageFake.setItem).toHaveBeenCalledWith(
        persistedStorageKey,
        JSON.stringify(result)
      );

      localStorageFake.setItem.mockClear();
    });

    it('should add multiple items', () => {
      const result = [...persistedCollection, book1, book3];
      const expected = cold('(-a|)', { a: result });
      expect(fixture.addToCollection([book1, book3])).toBeObservable(expected);
      expect(localStorageFake.setItem).toHaveBeenCalledWith(
        persistedStorageKey,
        JSON.stringify(result)
      );
      localStorageFake.setItem.mockClear();
    });
  });

  describe('removeFromCollection', () => {
    it('should remove item from collection', () => {
      const filterCollection = persistedCollection.filter(
        (f) => f.id !== book2.id
      );
      const expected = cold('(-a|)', { a: filterCollection });
      expect(fixture.removeFromCollection([book2.id])).toBeObservable(expected);
      expect(localStorageFake.getItem).toHaveBeenCalledWith(
        persistedStorageKey
      );
      expect(localStorageFake.setItem).toHaveBeenCalledWith(
        persistedStorageKey,
        JSON.stringify(filterCollection)
      );
      localStorageFake.getItem.mockClear();
    });

    it('should remove multiple items from collection', () => {
      const filterCollection = persistedCollection.filter(
        (f) => f.id !== book4.id
      );
      const expected = cold('(-a|)', { a: filterCollection });
      expect(fixture.removeFromCollection([book4.id])).toBeObservable(expected);
      expect(localStorageFake.getItem).toHaveBeenCalledWith(
        persistedStorageKey
      );
      expect(localStorageFake.setItem).toHaveBeenCalledWith(
        persistedStorageKey,
        JSON.stringify(filterCollection)
      );
      localStorageFake.getItem.mockClear();
    });

    it('should ignore items not present in collection', () => {
      const filterCollection = persistedCollection;
      const expected = cold('(-a|)', { a: filterCollection });
      expect(fixture.removeFromCollection([book1.id])).toBeObservable(expected);
    });
  });

  describe('deleteCollection', () => {
    it('should delete storage key and collection', () => {
      const expected = cold('(-a|)', { a: true });
      expect(fixture.deleteCollection()).toBeObservable(expected);
      expect(localStorageFake.removeItem).toHaveBeenCalledWith(
        persistedStorageKey
      );
      localStorageFake.removeItem.mockClear();
    });
  });
});
