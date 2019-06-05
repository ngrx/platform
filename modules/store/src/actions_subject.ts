import { Injectable, OnDestroy, Provider } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { Action } from './models';

export const INIT = '@ngrx/store/init' as '@ngrx/store/init';

const typeOf = (value: any) =>
  Object.prototype.toString
    .call(value)
    .slice(8, -1)
    .toLowerCase();

@Injectable()
export class ActionsSubject extends BehaviorSubject<Action>
  implements OnDestroy {
  constructor() {
    super({ type: INIT });
  }

  next(action: Action): void {
    if (typeOf(action) !== 'object') {
      throw new TypeError(`
        Dispatch expected an object, instead it received ${action}.
        If you're using the createAction function, make sure to invoke the function
        before dispatching the action. E.g. someAction should be someAction().`);
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
