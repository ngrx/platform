import { ErrorHandler } from '@angular/core';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

export type EffectsErrorHandler = <T extends Action>(
  observable$: Observable<T>,
  errorHandler: ErrorHandler
) => Observable<T>;

const MAX_NUMBER_OF_RETRY_ATTEMPTS = 10;

export function defaultEffectsErrorHandler<T extends Action>(
  observable$: Observable<T>,
  errorHandler: ErrorHandler,
  retryAttemptLeft: number = MAX_NUMBER_OF_RETRY_ATTEMPTS
): Observable<T> {
  return observable$.pipe(
    catchError((error) => {
      if (errorHandler) errorHandler.handleError(error);
      if (retryAttemptLeft <= 1) {
        return observable$; // last attempt
      }
      // Return observable that produces this particular effect
      return defaultEffectsErrorHandler(
        observable$,
        errorHandler,
        retryAttemptLeft - 1
      );
    })
  );
}
