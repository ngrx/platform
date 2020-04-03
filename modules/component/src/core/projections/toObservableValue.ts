import { from, of, Observable, ObservableInput } from 'rxjs';

export function toObservableValue<T>(
  p: ObservableInput<T> | undefined | null
): Observable<T | undefined | null> {
  return p == null ? of(p) : from(p);
}
