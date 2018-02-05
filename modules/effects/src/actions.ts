import { Injectable, Inject } from '@angular/core';
import { Action, ScannedActionsSubject } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Operator } from 'rxjs/Operator';
import { filter } from 'rxjs/operators';
import { OperatorFunction } from 'rxjs/interfaces';

@Injectable()
export class Actions<V = Action> extends Observable<V> {
  constructor(@Inject(ScannedActionsSubject) source?: Observable<V>) {
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

  ofType<V2 extends V = V>(...allowedTypes: string[]): Actions<V2> {
    return ofType<any>(...allowedTypes)(this as Actions<any>) as Actions<V2>;
  }
}

export function ofType<T extends Action>(...allowedTypes: string[]) {
  return filter((action: Action): action is T =>
    allowedTypes.some(type => type === action.type)
  );
}
