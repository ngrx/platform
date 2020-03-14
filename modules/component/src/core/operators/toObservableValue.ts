import { from, Observable, of } from 'rxjs';
import { isObservableGuard, isPromiseGuard, observableValue } from '../utils';

export function toObservableValue<T>() {
  return (
    potentialObservableValue$: observableValue<T> | undefined | null
  ): Observable<T | undefined | null> => {
    if (
      isPromiseGuard<T>(potentialObservableValue$) ||
      isObservableGuard<T>(potentialObservableValue$)
    ) {
      return from(potentialObservableValue$);
    }

    // Comparing to the literal null value with the == operator covers both null and undefined values.
    if (potentialObservableValue$ == null) {
      return of(potentialObservableValue$);
    }

    throw new Error(
      'Argument not observable. Only null/undefined or Promise/Observable-like values are allowed.'
    );
  };
}
