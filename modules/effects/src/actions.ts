import { Injectable, Inject } from '@angular/core';
import { Action, ScannedActionsSubject } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Operator } from 'rxjs/Operator';
import { filter } from 'rxjs/operator/filter';


@Injectable()
export class Actions extends Observable<Action> {
  constructor(@Inject(ScannedActionsSubject) actionsSubject: Observable<Action>) {
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
