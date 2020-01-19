import { Action } from '@ngrx/store';
import { merge, Notification, Observable } from 'rxjs';
import { ignoreElements, map, materialize, catchError } from 'rxjs/operators';

import { EffectNotification } from './effect_notification';
import { getSourceMetadata } from './effects_metadata';
import { getSourceForInstance } from './utils';
import { ErrorHandler } from '@angular/core';

export type EffectsErrorHandler = <T extends Action>(
  observable$: Observable<T>,
  errorHandler: ErrorHandler
) => Observable<T>;

export function mergeEffects(
  sourceInstance: any,
  globalErrorHandler: ErrorHandler,
  effectsErrorHandler: EffectsErrorHandler
): Observable<EffectNotification> {
  const sourceName = getSourceForInstance(sourceInstance).constructor.name;

  const observables$: Observable<any>[] = getSourceMetadata(sourceInstance).map(
    ({
      propertyName,
      dispatch,
      useEffectsErrorHandler,
    }): Observable<EffectNotification> => {
      const observable$: Observable<any> =
        typeof sourceInstance[propertyName] === 'function'
          ? sourceInstance[propertyName]()
          : sourceInstance[propertyName];

      const effectAction$ = useEffectsErrorHandler
        ? effectsErrorHandler(observable$, globalErrorHandler)
        : observable$;

      if (dispatch === false) {
        return effectAction$.pipe(ignoreElements());
      }

      const materialized$ = effectAction$.pipe(materialize());

      return materialized$.pipe(
        map(
          (notification: Notification<Action>): EffectNotification => ({
            effect: sourceInstance[propertyName],
            notification,
            propertyName,
            sourceName,
            sourceInstance,
          })
        )
      );
    }
  );

  return merge(...observables$);
}

export function resubscribeInCaseOfError<T extends Action>(
  observable$: Observable<T>,
  errorHandler: ErrorHandler
): Observable<T> {
  return observable$.pipe(
    catchError(error => {
      if (errorHandler) errorHandler.handleError(error);
      // Return observable that produces this particular effect
      return resubscribeInCaseOfError(observable$, errorHandler);
    })
  );
}
