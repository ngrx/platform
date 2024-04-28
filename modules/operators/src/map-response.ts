import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

type MapResponseObserver<T, S, E> = {
  next: (value: T) => S;
  error: (error: unknown) => E;
};

export function mapResponse<T, S, E>(
  observer: MapResponseObserver<T, S, E>
): (source$: Observable<T>) => Observable<S | E> {
  return (source$) =>
    source$.pipe(
      map((value) => observer.next(value)),
      catchError((error) => of(observer.error(error)))
    );
}
