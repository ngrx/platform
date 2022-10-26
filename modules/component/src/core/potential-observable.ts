import { combineLatest, from, isObservable, Observable } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

type Primitive = string | number | bigint | boolean | symbol | null | undefined;

type ObservableOrPromise<T> = Observable<T> | PromiseLike<T>;

type ObservableDictionary<PO> = Required<{
  [Key in keyof PO]: Observable<unknown>;
}>;

export type PotentialObservableResult<
  PO,
  ExtendedResult = never
> = PO extends ObservableOrPromise<infer Result>
  ? Result | ExtendedResult
  : PO extends Primitive
  ? PO
  : keyof PO extends never
  ? PO
  : PO extends ObservableDictionary<PO>
  ?
      | {
          [Key in keyof PO]: PO[Key] extends Observable<infer Value>
            ? Value
            : never;
        }
      | ExtendedResult
  : PO;

export function fromPotentialObservable<PO>(
  potentialObservable: PO
): Observable<PotentialObservableResult<PO>> {
  type Result = ReturnType<typeof fromPotentialObservable<PO>>;

  if (isObservable(potentialObservable)) {
    return potentialObservable as Result;
  }

  if (isObservableDictionary(potentialObservable)) {
    return combineLatest(
      toDistinctObsDictionary(potentialObservable)
    ) as Result;
  }

  if (isPromiseLike(potentialObservable)) {
    return from(potentialObservable) as Result;
  }

  return new Observable<PO>((subscriber) => {
    subscriber.next(potentialObservable);
  }) as Result;
}

function isPromiseLike(value: unknown): value is PromiseLike<unknown> {
  return typeof (value as PromiseLike<unknown>)?.then === 'function';
}

function isObservableDictionary(
  value: unknown
): value is Record<string, Observable<unknown>> {
  return (
    isDictionary(value) &&
    Object.keys(value).length > 0 &&
    Object.values(value).every(isObservable)
  );
}

function isDictionary(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

function toDistinctObsDictionary<
  OD extends Record<string, Observable<unknown>>
>(obsDictionary: OD): OD {
  return Object.keys(obsDictionary).reduce(
    (acc, key) => ({
      ...acc,
      [key]: obsDictionary[key].pipe(distinctUntilChanged()),
    }),
    {} as OD
  );
}
