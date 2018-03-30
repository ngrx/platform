import { Action } from '@ngrx/store';
import { merge, Notification, Observable } from 'rxjs';
import { ignoreElements, map, materialize } from 'rxjs/operators';

import { EffectNotification } from './effect_notification';
import { getSourceForInstance, getSourceMetadata } from './effects_metadata';
import { isOnRunEffects } from './on_run_effects';

export function mergeEffects(
  sourceInstance: any
): Observable<EffectNotification> {
  const sourceName = getSourceForInstance(sourceInstance).constructor.name;

  const observables: Observable<any>[] = getSourceMetadata(sourceInstance).map(
    ({ propertyName, dispatch }): Observable<EffectNotification> => {
      const observable: Observable<any> =
        typeof sourceInstance[propertyName] === 'function'
          ? sourceInstance[propertyName]()
          : sourceInstance[propertyName];

      if (dispatch === false) {
        return observable.pipe(ignoreElements());
      }

      const materialized$ = observable.pipe(materialize());

      return materialized$.pipe(
        map((notification: Notification<Action>): EffectNotification => ({
          effect: sourceInstance[propertyName],
          notification,
          propertyName,
          sourceName,
          sourceInstance,
        }))
      );
    }
  );

  return merge(...observables);
}

export function resolveEffectSource(sourceInstance: any) {
  const mergedEffects$ = mergeEffects(sourceInstance);

  if (isOnRunEffects(sourceInstance)) {
    return sourceInstance.ngrxOnRunEffects(mergedEffects$);
  }

  return mergedEffects$;
}
