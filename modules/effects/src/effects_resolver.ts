import { Action } from '@ngrx/store';
import { merge, Observable } from 'rxjs';
import { ignoreElements, map, materialize } from 'rxjs/operators';

import { EffectNotification } from './effect_notification';
import { getSourceMetadata } from './effects_metadata';
import { EffectsErrorHandler } from './effects_error_handler';
import { getSourceForInstance } from './utils';
import { ErrorHandler } from '@angular/core';

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

      const materialized$ = effectAction$.pipe(materialize<Action>());

      return materialized$.pipe(
        map(
          (notification): EffectNotification => ({
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
