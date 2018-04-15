import { Injectable, OnDestroy, Provider } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { Action } from './models';

export const INIT = '@ngrx/store/init' as '@ngrx/store/init';

@Injectable()
export class ActionsSubject extends BehaviorSubject<Action>
  implements OnDestroy {
  constructor() {
    super({ type: INIT });
  }

  next(action: Action): void {
    if (typeof action === 'undefined') {
      throw new TypeError(`Actions must be objects`);
    } else if (typeof action.type === 'undefined') {
      throw new TypeError(`Actions must have a type property`);
    }

    super.next(action);
  }

  complete() {
    /* noop */
  }

  ngOnDestroy() {
    super.complete();
  }
}

export const ACTIONS_SUBJECT_PROVIDERS: Provider[] = [ActionsSubject];
