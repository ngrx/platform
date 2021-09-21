import { Injectable, OnDestroy, Provider } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { Action } from './models';

export const INIT = '@ngrx/store/init' as const;

@Injectable()
export class ActionsSubject
  extends BehaviorSubject<Action>
  implements OnDestroy
{
  constructor() {
    super({ type: INIT });
  }

  override next(action: Action): void {
    if (typeof action === 'function') {
      throw new TypeError(`
        Dispatch expected an object, instead it received a function.
        If you're using the createAction function, make sure to invoke the function
        before dispatching the action. For example, someAction should be someAction().`);
    } else if (typeof action === 'undefined') {
      throw new TypeError(`Actions must be objects`);
    } else if (typeof action.type === 'undefined') {
      throw new TypeError(`Actions must have a type property`);
    }
    super.next(action);
  }

  override complete() {
    /* noop */
  }

  ngOnDestroy() {
    super.complete();
  }
}

export const ACTIONS_SUBJECT_PROVIDERS: Provider[] = [ActionsSubject];
