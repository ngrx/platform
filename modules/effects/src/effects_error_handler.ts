import { ErrorHandler } from '@angular/core';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

export type EffectsErrorHandler = <T extends Action>(
  observable$: Observable<T>,
  errorHandler: ErrorHandler
) => Observable<T>;

export const defaultEffectsErrorHandler: EffectsErrorHandler = <
  T extends Action
>(
  observable$: Observable<T>,
  errorHandler: ErrorHandler
): Observable<T> => {
  return observable$.pipe(
    catchError(error => {
      if (errorHandler) errorHandler.handleError(error);
      // Return observable that produces this particular effect
      return defaultEffectsErrorHandler(observable$, errorHandler);
    })
  );
};
