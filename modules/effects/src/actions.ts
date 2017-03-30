// TODO: This is a copy of this: https://github.com/redux-observable/redux-observable/blob/master/src/ActionsObservable.js
// Remove after this is resolved: https://github.com/redux-observable/redux-observable/issues/95
import { Injectable, Inject } from '@angular/core';
import { Action, ActionsSubject } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Operator } from 'rxjs/Operator';
import { filter } from 'rxjs/operator/filter';


@Injectable()
export class Actions extends Observable<Action> {
  constructor(@Inject(ActionsSubject) actionsSubject: Observable<Action>) {
    super();
    this.source = actionsSubject;
  }

  lift(operator: Operator<any, Action>): Observable<Action> {
    const observable = new Actions(this);
    observable.operator = operator;
    return observable;
  }

  ofType(...keys: string[]): Actions {
    return filter.call(this, ({ type }: {type: string}) => {
      const len = keys.length;
      if (len === 1) {
        return type === keys[0];
      } else {
        for (let i = 0; i < len; i++) {
          if (keys[i] === type) {
            return true;
          }
        }
      }
      return false;
    });
  }
}
