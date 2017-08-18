import { groupBy, GroupedObservable } from 'rxjs/operator/groupBy';
import { mergeMap } from 'rxjs/operator/mergeMap';
import { exhaustMap } from 'rxjs/operator/exhaustMap';
import { map } from 'rxjs/operator/map';
import { dematerialize } from 'rxjs/operator/dematerialize';
import { filter } from 'rxjs/operator/filter';
import { concat } from 'rxjs/observable/concat';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Notification } from 'rxjs/Notification';
import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { EffectNotification, verifyOutput } from './effect_notification';
import { getSourceForInstance } from './effects_metadata';
import { resolveEffectSource } from './effects_resolver';
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
          filter.call(
            map.call(
              exhaustMap.call(source$, resolveEffectSource),
              (output: EffectNotification) => {
                verifyOutput(output, this.errorReporter);

                return output.notification;
              }
            ),
            (notification: Notification<any>) => notification.kind === 'N'
          )
        )
    );
  }
}
