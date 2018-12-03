import { ErrorHandler, Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Notification, Observable, Subject } from 'rxjs';
import {
  dematerialize,
  exhaustMap,
  filter,
  groupBy,
  map,
  mergeMap,
} from 'rxjs/operators';

import { verifyOutput } from './effect_notification';
import { mergeEffects } from './effects_resolver';
import { getSourceForInstance } from './effects_metadata';
import {
  onIdentifyEffectsKey,
  onRunEffectsKey,
  onRunEffectsFn,
  OnRunEffects,
} from './lifecycle_hooks';

@Injectable()
export class EffectSources extends Subject<any> {
  constructor(private errorHandler: ErrorHandler) {
    super();
  }

  addEffects(effectSourceInstance: any) {
    this.next(effectSourceInstance);
  }

  /**
   * @internal
   */
  toActions(): Observable<Action> {
    return this.pipe(
      groupBy(getSourceForInstance),
      mergeMap(source$ => source$.pipe(groupBy(effectsInstance))),
      mergeMap(source$ =>
        source$.pipe(
          exhaustMap(resolveEffectSource),
          map(output => {
            verifyOutput(output, this.errorHandler);

            return output.notification;
          }),
          filter(
            (notification): notification is Notification<Action> =>
              notification.kind === 'N'
          ),
          dematerialize()
        )
      )
    );
  }
}

function effectsInstance(sourceInstance: any) {
  if (
    onIdentifyEffectsKey in sourceInstance &&
    typeof sourceInstance[onIdentifyEffectsKey] === 'function'
  ) {
    return sourceInstance[onIdentifyEffectsKey]();
  }

  return '';
}

function resolveEffectSource(sourceInstance: any) {
  const mergedEffects$ = mergeEffects(sourceInstance);

  if (isOnRunEffects(sourceInstance)) {
    return sourceInstance.ngrxOnRunEffects(mergedEffects$);
  }

  return mergedEffects$;
}

function isOnRunEffects(sourceInstance: {
  [onRunEffectsKey]?: onRunEffectsFn;
}): sourceInstance is OnRunEffects {
  const source = getSourceForInstance(sourceInstance);

  return (
    onRunEffectsKey in source && typeof source[onRunEffectsKey] === 'function'
  );
}
