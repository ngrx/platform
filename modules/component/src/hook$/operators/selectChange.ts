import { SimpleChanges } from '@angular/core';
import { pipe, UnaryFunction, Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

export function selectChange<T>(
  prop: string
): UnaryFunction<Observable<SimpleChanges>, Observable<T>> {
  return pipe(
    map((change: SimpleChanges) => change[prop].currentValue),
    distinctUntilChanged()
  );
}
