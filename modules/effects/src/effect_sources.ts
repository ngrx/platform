import { ErrorHandler, Injectable } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { Notification, Observable, Subject } from 'rxjs';
import {
  dematerialize,
  exhaustMap,
  filter,
  groupBy,
  map,
  mergeMap,
  tap,
} from 'rxjs/operators';

import {
  reportInvalidActions,
  EffectNotification,
} from './effect_notification';
import { mergeEffects } from './effects_resolver';
import {
  onIdentifyEffectsKey,
  onRunEffectsKey,
  OnRunEffects,
  onInitEffects,
} from './lifecycle_hooks';
import { getSourceForInstance } from './utils';

@Injectable()
export class EffectSources extends Subject<any> {
  constructor(private errorHandler: ErrorHandler, private store: Store<any>) {
    super();
  }

  addEffects(effectSourceInstance: any): void {
    this.next(effectSourceInstance);
  }

  /**
   * @internal
   */
  toActions(): Observable<Action> {
    return this.pipe(
      groupBy(getSourceForInstance),
      mergeMap(source$ => {
        return source$.pipe(
          groupBy(effectsInstance),
          tap(() => {
            if (
              onInitEffects in source$.key &&
              typeof source$.key[onInitEffects] === 'function'
            ) {
              this.store.dispatch(source$.key.ngrxOnInitEffects());
            }
          })
        );
      }),
      mergeMap(source$ =>
        source$.pipe(
          exhaustMap(resolveEffectSource(this.errorHandler)),
          map(output => {
            reportInvalidActions(output, this.errorHandler);
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

function resolveEffectSource(
  errorHandler: ErrorHandler
): (sourceInstance: any) => Observable<EffectNotification> {
  return sourceInstance => {
    const mergedEffects$ = mergeEffects(sourceInstance, errorHandler);

    if (isOnRunEffects(sourceInstance)) {
      return sourceInstance.ngrxOnRunEffects(mergedEffects$);
    }

    return mergedEffects$;
  };
}

function isOnRunEffects(
  sourceInstance: Partial<OnRunEffects>
): sourceInstance is OnRunEffects {
  const source = getSourceForInstance(sourceInstance);

  return (
    onRunEffectsKey in source && typeof source[onRunEffectsKey] === 'function'
  );
}
