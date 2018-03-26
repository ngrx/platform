import {
  groupBy,
  mergeMap,
  exhaustMap,
  map,
  dematerialize,
  filter,
} from 'rxjs/operators';
import { concat } from 'rxjs/observable/concat';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Notification } from 'rxjs/Notification';
import { ErrorHandler, Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { EffectNotification, verifyOutput } from './effect_notification';
import { getSourceForInstance } from './effects_metadata';
import { resolveEffectSource } from './effects_resolver';

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
      mergeMap(source$ =>
        source$.pipe(
          exhaustMap(resolveEffectSource),
          map((output: EffectNotification) => {
            verifyOutput(output, this.errorHandler);

            return output.notification;
          }),
          filter(
            (notification: Notification<any>) => notification.kind === 'N'
          ),
          dematerialize()
        )
      )
    );
  }
}
