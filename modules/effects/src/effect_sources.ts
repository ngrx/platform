import { ErrorHandler, Inject, Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Notification, Observable, Subject, merge } from 'rxjs';
import {
  dematerialize,
  exhaustMap,
  filter,
  groupBy,
  map,
  mergeMap,
  take,
} from 'rxjs/operators';

import {
  reportInvalidActions,
  EffectNotification,
} from './effect_notification';
import { EffectsErrorHandler } from './effects_error_handler';
import { mergeEffects } from './effects_resolver';
import {
  onIdentifyEffectsKey,
  onRunEffectsKey,
  OnRunEffects,
  onInitEffects,
  isOnIdentifyEffects,
  isOnRunEffects,
  isOnInitEffects,
} from './lifecycle_hooks';
import { EFFECTS_ERROR_HANDLER } from './tokens';
import { getSourceForInstance } from './utils';

@Injectable()
export class EffectSources extends Subject<any> {
  constructor(
    private errorHandler: ErrorHandler,
    @Inject(EFFECTS_ERROR_HANDLER)
    private effectsErrorHandler: EffectsErrorHandler
  ) {
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
      mergeMap((source$) => {
        return source$.pipe(groupBy(effectsInstance));
      }),
      mergeMap((source$) => {
        const effect$ = source$.pipe(
          exhaustMap((sourceInstance) => {
            return resolveEffectSource(
              this.errorHandler,
              this.effectsErrorHandler
            )(sourceInstance);
          }),
          map((output) => {
            reportInvalidActions(output, this.errorHandler);
            return output.notification;
          }),
          filter(
            (
              notification
            ): notification is Notification<Action> & {
              kind: 'N';
              value: Action;
            } => notification.kind === 'N' && notification.value != null
          ),
          dematerialize()
        );

        // start the stream with an INIT action
        // do this only for the first Effect instance
        const init$ = source$.pipe(
          take(1),
          filter(isOnInitEffects),
          map((instance) => instance.ngrxOnInitEffects())
        );

        return merge(effect$, init$);
      })
    );
  }
}

function effectsInstance(sourceInstance: any) {
  if (isOnIdentifyEffects(sourceInstance)) {
    return sourceInstance.ngrxOnIdentifyEffects();
  }

  return '';
}

function resolveEffectSource(
  errorHandler: ErrorHandler,
  effectsErrorHandler: EffectsErrorHandler
): (sourceInstance: any) => Observable<EffectNotification> {
  return (sourceInstance) => {
    const mergedEffects$ = mergeEffects(
      sourceInstance,
      errorHandler,
      effectsErrorHandler
    );

    if (isOnRunEffects(sourceInstance)) {
      return sourceInstance.ngrxOnRunEffects(mergedEffects$);
    }

    return mergedEffects$;
  };
}
