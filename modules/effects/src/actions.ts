import { Injectable, Inject } from '@angular/core';
import { Action, ScannedActionsSubject } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Operator } from 'rxjs/Operator';
import { filter } from 'rxjs/operator/filter';

@Injectable()
export class Actions<V = Action> extends Observable<V> {
  constructor( @Inject(ScannedActionsSubject) source?: Observable<V>) {
    super();

    if (source) {
      this.source = source;
    }
  }

  lift<R>(operator: Operator<V, R>): Observable<R> {
    const observable = new Actions<R>();
    observable.source = this;
    observable.operator = operator;
    return observable;
  }

  ofType(...allowedTypes: string[]): Actions {
    return filter.call(this, (action: Action) =>
      allowedTypes.some(type => type === action.type),
    );
  }

  groupOfType(...allowedTypes: string[]): Actions {
    const len = allowedTypes.length;
    let completedActions: { [key: string]: boolean } | null = null;

    return filter.call(this, (action: Action) => {
      const { type } = action;
      if (len > 1 && !completedActions) {
        completedActions = allowedTypes.reduce<{ [key: string]: boolean }>((obj, key) => {
          obj[key] = false;
          return obj;
        }, {});
      }

      if (len === 1) {
        return type === allowedTypes[0];
      } else if (completedActions && !completedActions[type] && allowedTypes.indexOf(type) > -1) {
        completedActions[type] = true;
        const isAllCompleted = Object.keys(completedActions)
          .every(key => !!completedActions && completedActions[key]);

        if (isAllCompleted) {
          completedActions = null;
        }

        return isAllCompleted;
      }

      return false;
    });
  }
}
