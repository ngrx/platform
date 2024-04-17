import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

type MapResponseObserver<T, E, R1, R2> = {
  next: (value: T) => R1;
  error: (error: E) => R2;
};

export function mapResponse<T, E, R1, R2>(
  observer: MapResponseObserver<T, E, R1, R2>
): (source$: Observable<T>) => Observable<R1 | R2> {
  return (source$) =>
    source$.pipe(
      map((value) => {
        return observer.next(value);
      }),
      catchError((error) => {
        return of(observer.error(error));
      })
    );
}
