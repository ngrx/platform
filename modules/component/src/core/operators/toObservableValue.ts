import { from, Observable, of } from 'rxjs';
import {
  ArgumentNotObservableError,
  isObservableGuard,
  isPromiseGuard,
  potentialObservableValue,
} from '../utils';

export function toObservableValue<T>(
  potentialObservableValue$: potentialObservableValue<T>
): Observable<T | undefined | null> {
  if (
    potentialObservableValue$ === undefined ||
    // @NOTICE This check is here to mirror the async pipes behaviour
    potentialObservableValue$ === null
  ) {
    return of(potentialObservableValue$);
  }

  if (
    isPromiseGuard(potentialObservableValue$) ||
    isObservableGuard(potentialObservableValue$)
  ) {
    return from(potentialObservableValue$);
  }

  throw new ArgumentNotObservableError();
}
