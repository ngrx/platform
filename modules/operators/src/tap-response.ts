import { EMPTY, Observable } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';

type TapResponseObserver<T, E> = {
  next: (value: T) => void;
  error: (error: E) => void;
  complete?: () => void;
  finalize?: () => void;
};

/**
 * Handles the response in ComponentStore effects in a safe way, without
 * additional boilerplate. It enforces that the error case is handled and
 * that the effect would still be running should an error occur.
 *
 * Takes optional callbacks for `complete` and `finalize`.
 *
 * @usageNotes
 *
 * ```ts
 * readonly loadUsers = rxMethod<void>(
 *   pipe(
 *     tap(() => this.isLoading.set(true)),
 *     exhaustMap(() =>
 *       this.usersService.getAll().pipe(
 *         tapResponse({
 *           next: (users) => this.users.set(users),
 *           error: (error: HttpErrorResponse) => this.logError(error.message),
 *           finalize: () => this.isLoading.set(false),
 *         })
 *       )
 *     )
 *   )
 * );
 * ```
 */
export function tapResponse<T, E = unknown>(
  observer: TapResponseObserver<T, E>
): (source$: Observable<T>) => Observable<T> {
  return (source) =>
    source.pipe(
      tap({ next: observer.next, complete: observer.complete }),
      catchError((error) => {
        observer.error(error);
        return EMPTY;
      }),
      observer.finalize ? finalize(observer.finalize) : (source$) => source$
    );
}
