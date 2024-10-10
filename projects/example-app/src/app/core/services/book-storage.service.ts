import { inject, Injectable, InjectionToken } from '@angular/core';

import { Observable, of, throwError } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { Book } from '@example-app/books/models';

// returns a dummy store if localStorage is not available
export function storageFactory() {
  return typeof window === 'undefined' || typeof localStorage === 'undefined'
    ? {
        getItem() {
          return '';
        },
        setItem() {},
        removeItem() {},
      }
    : localStorage;
}

export const LOCAL_STORAGE_TOKEN = new InjectionToken(
  'example-app-local-storage',
  { factory: storageFactory }
);

@Injectable({ providedIn: 'root' })
export class BookStorageService {
  private readonly collectionKey = 'books-app';

  private readonly storage = inject(LOCAL_STORAGE_TOKEN);

  supported(): Observable<boolean> {
    return this.storage !== null
      ? of(true)
      : throwError(() => 'Local Storage Not Supported');
  }

  getCollection(): Observable<Book[]> {
    return this.supported().pipe(
      map((_) => this.storage.getItem(this.collectionKey)),
      map((value: string | null) => (value ? JSON.parse(value) : []))
    );
  }

  addToCollection(records: Book[]): Observable<Book[]> {
    return this.getCollection().pipe(
      map((value: Book[]) => [...value, ...records]),
      tap((value: Book[]) =>
        this.storage.setItem(this.collectionKey, JSON.stringify(value))
      )
    );
  }

  removeFromCollection(ids: Array<string>): Observable<Book[]> {
    return this.getCollection().pipe(
      map((value: Book[]) => value.filter((item) => !ids.includes(item.id))),
      tap((value: Book[]) =>
        this.storage.setItem(this.collectionKey, JSON.stringify(value))
      )
    );
  }

  deleteCollection(): Observable<boolean> {
    return this.supported().pipe(
      tap(() => this.storage.removeItem(this.collectionKey))
    );
  }
}
