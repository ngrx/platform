import {
  Injectable,
  InjectionToken,
  FactoryProvider,
  Inject,
} from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Book } from '@example-app/books/models/book';

export interface IBookStorageService {
  supported(): Observable<boolean>;
  deleteCollection(): Observable<boolean>;
  addToCollection<T = Book>(records: T[]): Observable<T[]>;
  getCollection(): Observable<Book[]>;
  removeFromCollection<T extends { id: string } = Book>(
    ids: Array<string>
  ): Observable<T[]>;
}

export const LOCAL_STORAGE_TOKEN = new InjectionToken(
  'example-app-local-storage'
);

@Injectable({ providedIn: 'root' })
export class BookStorageService implements IBookStorageService {
  private collectionKey = 'books-app';

  supported(): Observable<boolean> {
    return this.storage !== undefined
      ? of(true)
      : throwError('Local Storage Not Supported');
  }

  getCollection<T = Book>(): Observable<T[]> {
    return this.supported().pipe(
      map(_ => this.storage.getItem(this.collectionKey)),
      map((value: string | null) => (value ? JSON.parse(value) : []))
    );
  }

  addToCollection<T = Book>(records: T[]): Observable<T[]> {
    return this.getCollection<T>().pipe(
      map((value: T[]) => [...value, ...records]),
      tap((value: T[]) =>
        this.storage.setItem(this.collectionKey, JSON.stringify(value))
      )
    );
  }

  removeFromCollection<T extends { id: string } = Book>(
    ids: Array<string>
  ): Observable<T[]> {
    return this.getCollection<T>().pipe(
      map((value: T[]) => value.filter(item => !ids.includes(item.id))),
      tap((value: T[]) =>
        this.storage.setItem(this.collectionKey, JSON.stringify(value))
      )
    );
  }

  deleteCollection(): Observable<boolean> {
    return this.supported().pipe(
      tap(() => this.storage.removeItem(this.collectionKey))
    );
  }

  constructor(@Inject(LOCAL_STORAGE_TOKEN) private storage: Storage) {}
}

export const LOCAL_STORAGE_PROVIDERS: FactoryProvider = {
  provide: LOCAL_STORAGE_TOKEN,
  useFactory: storageFactory,
};

export function storageFactory() {
  return typeof window === undefined || typeof localStorage === undefined
    ? null
    : window.localStorage;
}
