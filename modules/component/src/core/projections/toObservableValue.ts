import { from, of } from 'rxjs';
import {
  isObservableGuard,
  isPromiseGuard,
  PotentialObservableValue,
  Output,
} from '../utils';

export function toObservableValue<T>(
  p: PotentialObservableValue<T>
): Output<T> {
  // Comparing to the literal null value with the == operator covers both null and undefined values.
  if (p === null) {
    return of(p);
  }

  if (p === undefined) {
    return of(p);
  }

  if (isObservableGuard<T>(p)) {
    return p;
  }

  if (isPromiseGuard<T>(p)) {
    return from(p);
  }

  throw new Error(
    'Argument not observable. Only null/undefined or Promise/Observable-like values are allowed.'
  );
}
