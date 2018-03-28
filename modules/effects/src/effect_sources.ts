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
