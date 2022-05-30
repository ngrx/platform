import { from, isObservable, Observable } from 'rxjs';

export type ObservableOrPromise<T> = Observable<T> | PromiseLike<T>;

export type PotentialObservable<T> = T | ObservableOrPromise<T>;

export function fromPotentialObservable<T>(
  potentialObservable: PotentialObservable<T>
): Observable<T> {
  if (isObservable(potentialObservable)) {
    return potentialObservable;
  }

  if (isPromiseLike(potentialObservable)) {
    return from(potentialObservable);
  }

  return new Observable((subscriber) => {
    subscriber.next(potentialObservable);
  });
}

function isPromiseLike(value: unknown): value is PromiseLike<unknown> {
  return typeof (value as PromiseLike<unknown>)?.then === 'function';
}
