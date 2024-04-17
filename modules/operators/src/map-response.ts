import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export function mapResponse<T, E, R1, R2>(observerOrNext: {
  next: (value: T) => R1;
  error: (error: E) => R2;
}): (source$: Observable<T>) => Observable<R1 | R2> {
  return (source$) =>
    source$.pipe(
      map((value) => {
        return observerOrNext.next(value);
      }),
      catchError((error) => {
        return of(observerOrNext.error(error));
      })
    );
}
