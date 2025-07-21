import { Injectable, OnDestroy, Provider } from '@angular/core';
import { Subject } from 'rxjs';

import { Action } from './models';

/**
 * @public
 */
@Injectable()
export class ScannedActionsSubject
  extends Subject<Action>
  implements OnDestroy
{
  ngOnDestroy() {
    this.complete();
  }
}

/**
 * @public
 */
export const SCANNED_ACTIONS_SUBJECT_PROVIDERS: Provider[] = [
  ScannedActionsSubject,
];
