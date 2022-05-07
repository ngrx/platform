import { from, Observable, ObservableInput, of } from 'rxjs';

export type PotentialObservable<T> = ObservableInput<T> | null | undefined;

export function fromPotentialObservable<T>(
  potentialObservable: PotentialObservable<T>
): Observable<T | null | undefined> {
  if (!potentialObservable) {
    return of(potentialObservable as null | undefined);
  }

  return from(potentialObservable);
}
