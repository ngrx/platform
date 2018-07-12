import { Inject, Injectable } from '@angular/core';
import { Action, ScannedActionsSubject } from '@ngrx/store';
import { Observable, OperatorFunction, Operator } from 'rxjs';
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
}

/**
 * 'ofType' filters an Observable of Actions into an observable of the actions
 * whose type strings are passed to it.
 *
 * For example, `actions.pipe(ofType('add'))` returns an
 * `Observable<AddtionAction>`
 *
 * Properly typing this function is hard and requires some advanced TS tricks
 * below.
 *
 * Type narrowing automatically works, as long as your `actions` object
 * starts with a `Actions<SomeUnionOfActions>` instead of generic `Actions`.
 *
 * For backwards compatibility, when one passes a single type argument
 * `ofType<T>('something')` the result is an `Observable<T>`. Note, that `T`
 * completely overrides any possible inference from 'something'.
 *
 * Unfortunately, for unknown 'actions: Actions' these types will produce
 * 'Observable<never>'. In such cases one has to manually set the generic type
 * like `actions.ofType<AdditionAction>('add')`.
 */
export function ofType<
  V extends Extract<U, { type: T1 }>,
  T1 extends string = string,
  U extends Action = Action
>(t1: T1): OperatorFunction<U, V>;
export function ofType<
  V extends Extract<U, { type: T1 | T2 }>,
  T1 extends string = string,
  T2 extends string = string,
  U extends Action = Action
>(t1: T1, t2: T2): OperatorFunction<U, V>;
export function ofType<
  V extends Extract<U, { type: T1 | T2 | T3 }>,
  T1 extends string = string,
  T2 extends string = string,
  T3 extends string = string,
  U extends Action = Action
>(t1: T1, t2: T2, t3: T3): OperatorFunction<U, V>;
export function ofType<
  V extends Extract<U, { type: T1 | T2 | T3 | T4 }>,
  T1 extends string = string,
  T2 extends string = string,
  T3 extends string = string,
  T4 extends string = string,
  U extends Action = Action
>(t1: T1, t2: T2, t3: T3, t4: T4): OperatorFunction<U, V>;
export function ofType<
  V extends Extract<U, { type: T1 | T2 | T3 | T4 | T5 }>,
  T1 extends string = string,
  T2 extends string = string,
  T3 extends string = string,
  T4 extends string = string,
  T5 extends string = string,
  U extends Action = Action
>(t1: T1, t2: T2, t3: T3, t4: T4, t5: T5): OperatorFunction<U, V>;
/**
 * Fallback for more than 5 arguments.
 * There is no inference, so the return type is the same as the input -
 * Observable<Action>.
 *
 * We provide a type parameter, even though TS will not infer it from the
 * arguments, to preserve backwards compatibility with old versions of ngrx.
 */
export function ofType<V extends Action>(
  ...allowedTypes: string[]
): OperatorFunction<Action, V>;
export function ofType(
  ...allowedTypes: string[]
): OperatorFunction<Action, Action> {
  return filter((action: Action) =>
    allowedTypes.some(type => type === action.type)
  );
}
