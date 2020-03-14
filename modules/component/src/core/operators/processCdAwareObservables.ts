import { distinctUntilChanged, map, switchAll } from 'rxjs/operators';
import { MonoTypeOperatorFunction, Observable } from 'rxjs';
import { RemainHigherOrder } from '../utils';
import { toObservableValue } from './toObservableValue';

/**
 * function processCdAwareObservables
 *
 * @description
 * It is a RxJS operator function that, takes observable values like a Promise or an Observable,
 * flattens its values and renders the emitted values.
 * Additionally it adds custom behaviour to the observable
 *
 * @param resetContextBehaviour
 * The behaviour that resets the rendered value in e.g. a pipe or directive
 *
 * @param updateContextBehaviour
 * The behaviour that update the rendered value in emitted by the passed observable value
 *
 * @param configurableBehaviour
 * The custom behaviour added to the observable e.g. coalescing of changes
 *
 * @return MonoTypeOperatorFunction<T>
 */
export function processCdAwareObservables<T>(
  resetContextBehaviour: RemainHigherOrder<T>,
  updateContextBehaviour: RemainHigherOrder<T>,
  configurableBehaviour: RemainHigherOrder<T>
): MonoTypeOperatorFunction<T> {
  return (o$: Observable<any>): Observable<T> => {
    return o$.pipe(
      // Ignore observables of the same instances
      distinctUntilChanged(),
      // try to convert it to values, throw if not possible
      // @TODO fix any type
      map((o: Observable<any>) => toObservableValue(o)),
      // Add behaviour to apply changes to context for new observables
      resetContextBehaviour,
      // Add behaviour to apply changes to context for new values
      updateContextBehaviour,
      // Add behaviour to apply configurable behaviour
      configurableBehaviour,
      // unsubscribe from previous observables
      // then flatten the latest internal observables into the output
      // @NOTICE applied behaviour (on the values, not the observable) will fire here
      switchAll(),
      // reduce number of emissions to distinct values compared to the previous one
      distinctUntilChanged()
    );
  };
}
