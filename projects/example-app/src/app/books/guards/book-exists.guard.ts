import { inject } from '@angular/core';
import { Router, ActivatedRouteSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, filter, map, switchMap, take, tap } from 'rxjs/operators';

import { GoogleBooksService } from '@example-app/core/services';
import { BookActions } from '@example-app/books/actions/book.actions';
import * as fromBooks from '@example-app/books/reducers';

/**
 * Guards are hooks into the route resolution process, providing an opportunity
 * to inform the router's navigation process whether the route should continue
 * to activate this route. Guards must return an observable of true or false.
 */

export const bookExistsGuard = (
  route: ActivatedRouteSnapshot
): Observable<boolean> => {
  const store = inject(Store);
  const googleBooks = inject(GoogleBooksService);
  const router = inject(Router);

  /**
   * This method creates an observable that waits for the `loaded` property
   * of the collection state to turn `true`, emitting one time once loading
   * has finished.
   */
  function waitForCollectionToLoad(): Observable<boolean> {
    return store.select(fromBooks.selectCollectionLoaded).pipe(
      filter((loaded) => loaded),
      take(1)
    );
  }

  /**
   * This method checks if a book with the given ID is already registered
   * in the Store
   */
  function hasBookInStore(id: string): Observable<boolean> {
    return store.select(fromBooks.selectBookEntities).pipe(
      map((entities) => !!entities[id]),
      take(1)
    );
  }

  /**
   * This method loads a book with the given ID from the API and caches
   * it in the store, returning `true` or `false` if it was found.
   */
  function hasBookInApi(id: string): Observable<boolean> {
    return googleBooks.retrieveBook(id).pipe(
      map((bookEntity) => BookActions.loadBook({ book: bookEntity })),
      tap((action) => store.dispatch(action)),
      map((book) => !!book),
      catchError(() => {
        router.navigate(['/404']);
        return of(false);
      })
    );
  }

  /**
   * `hasBook` composes `hasBookInStore` and `hasBookInApi`. It first checks
   * if the book is in store, and if not it then checks if it is in the
   * API.
   */
  function hasBook(id: string): Observable<boolean> {
    return hasBookInStore(id).pipe(
      switchMap((inStore) => {
        if (inStore) {
          return of(inStore);
        }

        return hasBookInApi(id);
      })
    );
  }

  /**
   * This is the actual method the router will call when our guard is run.
   *
   * Our guard waits for the collection to load, then it checks if we need
   * to request a book from the API or if we already have it in our cache.
   * If it finds it in the cache or in the API, it returns an Observable
   * of `true` and the route is rendered successfully.
   *
   * If it was unable to find it in our cache or in the API, this guard
   * will return an Observable of `false`, causing the router to move
   * on to the next candidate route. In this case, it will move on
   * to the 404 page.
   */
  return waitForCollectionToLoad().pipe(
    switchMap(() => hasBook(route.params['id']))
  );
};
