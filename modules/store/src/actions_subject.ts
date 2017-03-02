import { Injectable, OnDestroy, Provider } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { Action } from './models';


@Injectable()
export class ActionsSubject extends Subject<Action> implements OnDestroy {
  constructor() {
    super();
  }

  next(action: Action): void {
    if (typeof action === 'undefined') {
      throw new Error(`Actions must be objects`);
    }
    else if (typeof action.type === 'undefined') {
      throw new Error(`Actions must have a type property`);
    }

    super.next(action);
  }

  complete() { /* noop */ }

  ngOnDestroy() {
    super.complete();
  }
}

export const ACTIONS_SUBJECT_PROVIDERS: Provider[] = [
  ActionsSubject
];
