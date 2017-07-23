import { Injectable, Inject } from '@angular/core';
import { Action, ScannedActionsSubject } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Operator } from 'rxjs/Operator';
import { filter } from 'rxjs/operator/filter';

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
    return filter.call(this, (action: Action) =>
      allowedTypes.some(type => type === action.type)
    );
  }

  ofClass<T1 extends V>(a: new () => T1): Actions<T1>;
  ofClass<T1 extends V, T2 extends V>(
    a: new () => T1,
    b: new () => T2
  ): Actions<T1 | T2>;
  ofClass<T1 extends V, T2 extends V, T3 extends V>(
    a: new () => T1,
    b: new () => T2,
    c: new () => T3
  ): Actions<T1 | T2 | T3>;
  ofClass<T1 extends V, T2 extends V, T3 extends V, T4 extends V>(
    a: new () => T1,
    b: new () => T2,
    c: new () => T3,
    d: new () => T4
  ): Actions<T1 | T2 | T3 | T4>;
  ofClass(...allowedClasses: (new () => any)[]): Actions<V> {
    return filter.call(this, (action: Action) =>
      allowedClasses.some(allowedClass => action instanceof allowedClass)
    );
  }
}
