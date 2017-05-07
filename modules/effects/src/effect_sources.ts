import { groupBy, GroupedObservable } from 'rxjs/operator/groupBy';
import { mergeMap } from 'rxjs/operator/mergeMap';
import { exhaustMap } from 'rxjs/operator/exhaustMap';
import { map } from 'rxjs/operator/map';
import { dematerialize } from 'rxjs/operator/dematerialize';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Injectable, isDevMode } from '@angular/core';
import { Action } from '@ngrx/store';
import { getSourceForInstance } from './effects_metadata';
import { resolveEffectSource, EffectNotification } from './effects_resolver';
import { ErrorReporter } from './error_reporter';

@Injectable()
export class EffectSources extends Subject<any> {
  constructor(private errorReporter: ErrorReporter) {
    super();
  }

  addEffects(effectSourceInstance: any) {
    this.next(effectSourceInstance);
  }

  /**
   * @private
   */
  toActions(): Observable<Action> {
    return mergeMap.call(
      groupBy.call(this, getSourceForInstance),
      (source$: GroupedObservable<any, any>) =>
        dematerialize.call(
          map.call(
            exhaustMap.call(source$, resolveEffectSource),
            (output: EffectNotification) => {
              switch (output.notification.kind) {
                case 'N': {
                  const action = output.notification.value;
                  const isInvalidAction =
                    !action || !action.type || typeof action.type !== 'string';

                  if (isInvalidAction) {
                    const errorReason = `Effect "${output.sourceName}.${output.propertyName}" dispatched an invalid action`;

                    this.errorReporter.report(errorReason, {
                      Source: output.sourceInstance,
                      Effect: output.effect,
                      Dispatched: action,
                      Notification: output.notification,
                    });
                  }

                  break;
                }
                case 'E': {
                  const errorReason = `Effect "${output.sourceName}.${output.propertyName}" threw an error`;

                  this.errorReporter.report(errorReason, {
                    Source: output.sourceInstance,
                    Effect: output.effect,
                    Error: output.notification.error,
                    Notification: output.notification,
                  });

                  break;
                }
              }

              return output.notification;
            },
          ),
        ),
    );
  }
}
