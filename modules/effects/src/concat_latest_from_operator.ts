import { Observable, of, OperatorFunction } from 'rxjs';
import { concatMap, withLatestFrom } from 'rxjs/operators';

type TypeOfObservable<T> = T extends Observable<infer U> ? U : never;

export function concatLatestFrom<T extends [Observable<unknown>], V>(
  observableFactory: (value: V) => T
): OperatorFunction<V, [V, TypeOfObservable<T[0]>]>;
export function concatLatestFrom<
  T extends [Observable<unknown>, Observable<unknown>],
  V
>(
  observableFactory: (value: V) => T
): OperatorFunction<V, [V, TypeOfObservable<T[0]>, TypeOfObservable<T[1]>]>;
export function concatLatestFrom<
  T extends [Observable<unknown>, Observable<unknown>, Observable<unknown>],
  V
>(
  observableFactory: (value: V) => T
): OperatorFunction<
  V,
  [V, TypeOfObservable<T[0]>, TypeOfObservable<T[1]>, TypeOfObservable<T[2]>]
>;
export function concatLatestFrom<
  T extends [
    Observable<unknown>,
    Observable<unknown>,
    Observable<unknown>,
    Observable<unknown>
  ],
  V
>(
  observableFactory: (value: V) => T
): OperatorFunction<
  V,
  [
    V,
    TypeOfObservable<T[0]>,
    TypeOfObservable<T[1]>,
    TypeOfObservable<T[2]>,
    TypeOfObservable<T[3]>
  ]
>;
export function concatLatestFrom<
  T extends [
    Observable<unknown>,
    Observable<unknown>,
    Observable<unknown>,
    Observable<unknown>,
    Observable<unknown>
  ],
  V
>(
  observableFactory: (value: V) => T
): OperatorFunction<
  V,
  [
    V,
    TypeOfObservable<T[0]>,
    TypeOfObservable<T[1]>,
    TypeOfObservable<T[2]>,
    TypeOfObservable<T[3]>,
    TypeOfObservable<T[4]>
  ]
>;
export function concatLatestFrom<
  T extends [
    Observable<unknown>,
    Observable<unknown>,
    Observable<unknown>,
    Observable<unknown>,
    Observable<unknown>,
    Observable<unknown>
  ],
  V
>(
  observableFactory: (value: V) => T
): OperatorFunction<
  V,
  [
    V,
    TypeOfObservable<T[0]>,
    TypeOfObservable<T[1]>,
    TypeOfObservable<T[2]>,
    TypeOfObservable<T[3]>,
    TypeOfObservable<T[4]>,
    TypeOfObservable<T[5]>
  ]
>;
export function concatLatestFrom<
  T extends [
    Observable<unknown>,
    Observable<unknown>,
    Observable<unknown>,
    Observable<unknown>,
    Observable<unknown>,
    Observable<unknown>,
    Observable<unknown>
  ],
  V
>(
  observableFactory: (value: V) => T
): OperatorFunction<
  V,
  [
    V,
    TypeOfObservable<T[0]>,
    TypeOfObservable<T[1]>,
    TypeOfObservable<T[2]>,
    TypeOfObservable<T[3]>,
    TypeOfObservable<T[4]>,
    TypeOfObservable<T[5]>,
    TypeOfObservable<T[6]>
  ]
>;
export function concatLatestFrom<
  T extends [
    Observable<unknown>,
    Observable<unknown>,
    Observable<unknown>,
    Observable<unknown>,
    Observable<unknown>,
    Observable<unknown>,
    Observable<unknown>,
    Observable<unknown>
  ],
  V
>(
  observableFactory: (value: V) => T
): OperatorFunction<
  V,
  [
    V,
    TypeOfObservable<T[0]>,
    TypeOfObservable<T[1]>,
    TypeOfObservable<T[2]>,
    TypeOfObservable<T[3]>,
    TypeOfObservable<T[4]>,
    TypeOfObservable<T[5]>,
    TypeOfObservable<T[6]>,
    TypeOfObservable<T[7]>
  ]
>;
export function concatLatestFrom<T extends Observable<unknown>[], V>(
  observableFactory: (value: V) => T
): OperatorFunction<V, [V, ...any[]]>;
export function concatLatestFrom<T extends Observable<unknown>, V>(
  observableFactory: (value: V) => T
): OperatorFunction<V, [V, TypeOfObservable<T>]>;

/**
 * @description
 * RxJS operator that lazily evaluates an Observable or list of Observables.
 *
 * Use to mitigate performance impact of `store.select`
 *
 * ## Example
 * ```ts
 * effectName$ = createEffect(() =>
 *   this.actions$.pipe(
 *     ofType(FeatureActions.actionOne),
 *     // The call to this.store.select will not be performed until actionOne is received
 *     concatLatestFrom(() => this.store.select(getDataState)),
 *     filter(([action, data]) => data.enabled),
 *     map(() => FeatureActions.actionTwo())
 *   )
 * );
 * ```
 * @param observablesFactory A factory function which returns an `Observable` or `Observable[]`.
 * @returns Returns an `OperatorFunction` that returns an Observable which combines the source and latest value from input Observables
 */
export function concatLatestFrom<V>(
  observablesFactory:
    | ((value: V) => Observable<any>)
    | ((value: V) => Observable<any>[])
): OperatorFunction<V, [V, ...any[]]> {
  return concatMap((value: V) => {
    const observables = observablesFactory(value);
    const observablesAsArray = Array.isArray(observables)
      ? observables
      : [observables];
    return of(value).pipe(withLatestFrom(...observablesAsArray)) as Observable<
      [V, ...unknown[]]
    >;
  }) as OperatorFunction<V, [V, ...any[]]>;
}
