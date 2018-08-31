import { Inject, Injectable } from '@angular/core';
import { Action, ScannedActionsSubject } from '@ngrx/store';
import { Observable, Operator, OperatorFunction } from 'rxjs';
import { filter } from 'rxjs/operators';

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

  /**
   * @deprecated from 6.1.0. Use the pipeable `ofType` operator instead.
   */
  ofType<V2 extends V = V>(...allowedTypes: string[]): Actions<V2> {
    return ofType<any>(...allowedTypes)(this as Actions<any>) as Actions<V2>;
  }
}

export function ofType<T extends Action>(
  ...allowedTypes: string[]
): OperatorFunction<Action, T> {
  return filter(
    (action: Action): action is T =>
      allowedTypes.some(type => type === action.type)
  );
}
