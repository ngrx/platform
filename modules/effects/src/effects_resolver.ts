import { Action } from '@ngrx/store';
import { merge, Notification, Observable } from 'rxjs';
import { ignoreElements, map, materialize, catchError } from 'rxjs/operators';

import { EffectNotification } from './effect_notification';
import { getSourceMetadata } from './effects_metadata';
import { getSourceForInstance } from './utils';
import { ErrorHandler } from '@angular/core';

export function mergeEffects(
  sourceInstance: any,
  errorHandler?: ErrorHandler
): Observable<EffectNotification> {
  const sourceName = getSourceForInstance(sourceInstance).constructor.name;

  const observables$: Observable<any>[] = getSourceMetadata(sourceInstance).map(
    ({
      propertyName,
      dispatch,
      resubscribeOnError,
    }): Observable<EffectNotification> => {
      const observable$: Observable<any> =
        typeof sourceInstance[propertyName] === 'function'
          ? sourceInstance[propertyName]()
          : sourceInstance[propertyName];

      const resubscribeInCaseOfError = (
        observable$: Observable<any>
      ): Observable<any> =>
        observable$.pipe(
          catchError(error => {
            if (errorHandler) errorHandler.handleError(error);
            // Return observable that produces this particular effect
            return resubscribeInCaseOfError(observable$);
          })
        );

      const resubscribable$ = resubscribeOnError
        ? resubscribeInCaseOfError(observable$)
        : observable$;

      if (dispatch === false) {
        return resubscribable$.pipe(ignoreElements());
      }

      const materialized$ = resubscribable$.pipe(materialize());

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
