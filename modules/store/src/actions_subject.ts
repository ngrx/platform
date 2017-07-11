import { Injectable, OnDestroy, Provider } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { Action, ActionThunk } from './models';
import { isAction } from './utils';


export const INIT = '@ngrx/store/init';

@Injectable()
export class ActionsSubject extends BehaviorSubject<Action> implements OnDestroy {
  constructor() {
    super({ type: INIT });
  }

  next(action: Action): void {
    if (typeof action === 'undefined') {
      throw new Error(`Actions must be objects`);
    }
    else if (!isAction(action)) {
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
