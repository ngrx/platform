import { Observable, ObservedValueOf, of, OperatorFunction, pipe } from 'rxjs';
import { concatMap, withLatestFrom } from 'rxjs/operators';

// The array overload is needed first because we want to maintain the proper order in the resulting tuple
export function concatLatestFrom<T extends Observable<unknown>[], V>(
  observablesFactory: (value: V) => [...T]
): OperatorFunction<V, [V, ...{ [i in keyof T]: ObservedValueOf<T[i]> }]>;
export function concatLatestFrom<T extends Observable<unknown>, V>(
  observableFactory: (value: V) => T
): OperatorFunction<V, [V, ObservedValueOf<T>]>;
/**
 * 'concatLatestFrom' combines the source value
 * and the last available value from a lazily evaluated Observable
 * in a new array
 */
export function concatLatestFrom<
  T extends Observable<unknown>[] | Observable<unknown>,
  V,
  R = [
    V,
    ...(T extends Observable<unknown>[]
      ? { [i in keyof T]: ObservedValueOf<T[i]> }
      : [ObservedValueOf<T>])
  ]
>(observablesFactory: (value: V) => T): OperatorFunction<V, R> {
  return pipe(
    concatMap((value) => {
      const observables = observablesFactory(value);
      const observablesAsArray = Array.isArray(observables)
        ? observables
        : [observables];
      return of(value).pipe(
        withLatestFrom(...observablesAsArray)
      ) as Observable<R>;
    })
  );
}
