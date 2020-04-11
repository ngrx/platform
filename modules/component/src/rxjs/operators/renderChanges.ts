import { MonoTypeOperatorFunction, Observable } from 'rxjs';
import { CdStrategy } from '../../core';
import { tap } from 'rxjs/operators';

/**
 * renderChanges
 *
 * This operator is useful in situations where the developer can't code reactively everywhere, but wants the component to rerender on emission.
 *
 * A good example would be assigning the value arrived over a Observable to a class property and rerender the component.
 *
 *
 * @param strategy
 */
export function renderChanges<T>(
  strategy: CdStrategy<T>
): MonoTypeOperatorFunction<T> {
  return (s: Observable<T>): Observable<T> => {
    return s.pipe(
      strategy.behaviour(),
      tap(() => strategy.render())
    );
  };
}
