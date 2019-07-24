import { pipe, UnaryFunction, Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { STATE_DEFAULT } from '../../core/state-default';

export function selectSlice<T>(
  mapToSliceFn: (s: any) => any
): UnaryFunction<Observable<T>, Observable<T>> {
  return pipe(
    map(s => {
      return s !== STATE_DEFAULT ? mapToSliceFn(s) : s;
    }),
    distinctUntilChanged<T>()
  );
}
