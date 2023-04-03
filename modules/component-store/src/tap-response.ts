import { EMPTY, Observable } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';

type TapResponseObserver<T, E> = {
  next: (value: T) => void;
  error: (error: E) => void;
  complete?: () => void;
  finalize?: () => void;
};

export function tapResponse<T, E = unknown>(
  observer: TapResponseObserver<T, E>
): (source$: Observable<T>) => Observable<T>;
export function tapResponse<T, E = unknown>(
  next: (value: T) => void,
  error: (error: E) => void,
  complete?: () => void
): (source$: Observable<T>) => Observable<T>;
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
 * readonly dismissAlert = this.effect<Alert>((alert$) => {
 *   return alert$.pipe(
 *     concatMap(
 *       (alert) => this.alertsService.dismissAlert(alert).pipe(
 *         tapResponse(
 *           (dismissedAlert) => this.alertDismissed(dismissedAlert),
 *           (error: { message: string }) => this.logError(error.message)
 *         )
 *       )
 *     )
 *   );
 * });
 *
 * readonly loadUsers = this.effect<void>((trigger$) => {
 *   return trigger$.pipe(
 *     tap(() => this.patchState({ loading: true })),
 *     exhaustMap(() =>
 *       this.usersService.getAll().pipe(
 *         tapResponse({
 *           next: (users) => this.patchState({ users }),
 *           error: (error: HttpErrorResponse) => this.logError(error.message),
 *           finalize: () => this.patchState({ loading: false }),
 *         })
 *       )
 *     )
 *   );
 * });
 * ```
 */
export function tapResponse<T, E>(
  observerOrNext: TapResponseObserver<T, E> | ((value: T) => void),
  error?: (error: E) => void,
  complete?: () => void
): (source$: Observable<T>) => Observable<T> {
  const observer: TapResponseObserver<T, E> =
    typeof observerOrNext === 'function'
      ? {
          next: observerOrNext,
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          error: error!,
          complete,
        }
      : observerOrNext;

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
