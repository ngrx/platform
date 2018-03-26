import { merge } from 'rxjs/observable/merge';
import { ignoreElements, materialize, map } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { Notification } from 'rxjs/Notification';
import { Action } from '@ngrx/store';
import { EffectNotification } from './effect_notification';
import { getSourceMetadata, getSourceForInstance } from './effects_metadata';
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

      return observable.pipe(
        materialize(),
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
