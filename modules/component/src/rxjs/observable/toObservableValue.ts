import { from, of, Observable, ObservableInput } from 'rxjs';

/**
 * @description
 *
 * This operator ensures the passed value is of the right type for `CdAware`.
 * It takes `null`, `undefined` or `Observable<T>` and returns `Observable<null, undefined, T>`.
 * Every other value throws an error.
 *
 * @param {Observable<T> | Promise<T> | undefined | null} p -
 * @returns {Observable<T| undefined | null>} - proper observable values
 *
 * @usageNotes
 *
 * ```ts
 * import { toObservableValue } from `projections/toObservableValue`;
 *
 * const toObservableValue()
 *  .pipe(switchAll())
 *  .subscribe((n) => console.log(n););
 * ```
 */
export function toObservableValue<T>(
  p: ObservableInput<T> | undefined | null
): Observable<T | undefined | null> {
  return p == null ? of(p) : from(p);
}
