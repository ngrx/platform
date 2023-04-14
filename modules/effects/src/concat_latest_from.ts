import { Observable, ObservableInput, ObservedValueOf, OperatorFunction, combineLatest } from 'rxjs';
import { concatMap, map, take } from 'rxjs/operators';

// The array overload is needed first because we want to maintain the proper order in the resulting tuple
export function concatLatestFrom<T extends Observable<unknown>[], V>(
  observablesFactory: (value: V) => [...T]
): OperatorFunction<V, [V, ...{ [i in keyof T]: ObservedValueOf<T[i]> }]>;
export function concatLatestFrom<T extends Observable<unknown>, V>(
  observableFactory: (value: V) => T
): OperatorFunction<V, [V, ObservedValueOf<T>]>;
/**
 * `concatLatestFrom` combines the source value
 * and the last available value from a lazily evaluated Observable
 * in a new array
 *
 * @usageNotes
 *
 * Select the active customer from the NgRx Store
 *
 * ```ts
 * import { concatLatestFrom } from '@ngrx/effects';
 * import * as fromCustomers from '../customers';
 *
 * this.actions$.pipe(
 *  concatLatestFrom(() => this.store.select(fromCustomers.selectActiveCustomer))
 * )
 * ```
 *
 * Select a customer from the NgRx Store by its id that is available on the action
 *
 * ```ts
 * import { concatLatestFrom } from '@ngrx/effects';
 * import * fromCustomers from '../customers';
 *
 * this.actions$.pipe(
 *  concatLatestFrom((action) => this.store.select(fromCustomers.selectCustomer(action.customerId)))
 * )
 * ```
 */
export function concatLatestFrom<
  T extends ObservableInput<unknown>[] | ObservableInput<unknown>,
  V,
  R = [
    V,
    ...(T extends ObservableInput<unknown>[]
      ? { [i in keyof T]: ObservedValueOf<T[i]> }
      : [ObservedValueOf<T>])
  ]
>(observablesFactory: (value: V) => T): OperatorFunction<V, R> {
  return concatMap(
    (value) =>
      combineLatest(observablesFactory(value)).pipe(
        take(1),
        map((others: unknown[]) => [value, ...others])
      ) as Observable<R>
  );
}
