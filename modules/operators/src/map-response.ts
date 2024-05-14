import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

type MapResponseObserver<T, E, R1, R2> = {
  next: (value: T) => R1;
  error: (error: E) => R2;
};

/**
 * `mapResponse` is a map operator with included error handling.
 * It is similar to `tapResponse`, but allows to map the response as well.
 *
 * The main use case is for NgRx Effects which requires an action to be dispatched.
 *
 * @usageNotes
 * ```ts
 * export const loadAllUsers = createEffect((
 *   actions$ = inject(Actions),
 *   usersService = inject(UsersService)
 * ) => {
 *   return actions$.pipe(
 *     ofType(UsersPageActions.opened),
 *     exhaustMap(() => {
 *       return usersService.getAll().pipe(
 *         mapResponse({
 *           next: (users) => UsersApiActions.usersLoadedSuccess({ users }),
 *           error: (error) => UsersApiActions.usersLoadedFailure({ error }),
 *         })
 *       );
 *     })
 *   );
 * });
 * ```
 */
export function mapResponse<T, E, R1, R2>(
  observer: MapResponseObserver<T, E, R1, R2>
): (source$: Observable<T>) => Observable<R1 | R2> {
  return (source$) =>
    source$.pipe(
      map((value) => observer.next(value)),
      catchError((error) => of(observer.error(error)))
    );
}
