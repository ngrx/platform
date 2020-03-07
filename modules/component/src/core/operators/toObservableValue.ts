import { from, Observable, of } from 'rxjs';
import {
  ArgumentNotObservableError,
  isObservableGuard,
  isPromiseGuard,
} from '../utils';

export function toObservableValue<T>(
  potentialObservableValue$: Observable<T> | Promise<T> | undefined | null
): Observable<T | undefined | null> {
  if (
    potentialObservableValue$ === undefined ||
    // @NOTICE This check is here to mirror the async pipes behaviour
    potentialObservableValue$ === null
  ) {
    return of(potentialObservableValue$);
  }

  if (
    isPromiseGuard<T>(potentialObservableValue$) ||
    isObservableGuard<T>(potentialObservableValue$)
  ) {
    return from(potentialObservableValue$);
  }

  throw new ArgumentNotObservableError();
}
