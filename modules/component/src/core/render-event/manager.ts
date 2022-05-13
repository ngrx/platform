import {
  distinctUntilChanged,
  Observable,
  pipe,
  ReplaySubject,
  switchMap,
  tap,
} from 'rxjs';
import { ErrorRenderEvent, NextRenderEvent, RenderEvent } from './models';
import { combineRenderEventHandlers, RenderEventHandlers } from './handlers';
import {
  fromPotentialObservable,
  PotentialObservable,
} from '../potential-observable';

export interface RenderEventManager<T> {
  nextPotentialObservable(potentialObservable: PotentialObservable<T>): void;

  handlePotentialObservableChanges(): Observable<RenderEvent<T>>;
}

export function createRenderEventManager<T>(
  handlers: RenderEventHandlers<T>
): RenderEventManager<T> {
  const handleRenderEvent = combineRenderEventHandlers(handlers);
  const potentialObservable$ = new ReplaySubject<PotentialObservable<T>>(1);

  return {
    nextPotentialObservable(potentialObservable) {
      potentialObservable$.next(potentialObservable);
    },
    handlePotentialObservableChanges() {
      return potentialObservable$.pipe(
        distinctUntilChanged(),
        switchMapToRenderEvent(),
        distinctUntilChanged(renderEventComparator),
        tap(handleRenderEvent)
      );
    },
  };
}

function switchMapToRenderEvent<T>(): (
  source: Observable<PotentialObservable<T>>
) => Observable<RenderEvent<T>> {
  return pipe(
    switchMap((potentialObservable) => {
      const observable$ = fromPotentialObservable(potentialObservable);
      let reset = true;

      return new Observable<RenderEvent<T>>((subscriber) => {
        const subscription = observable$.subscribe({
          next(value) {
            subscriber.next({ type: 'next', value, reset });
            reset = false;
          },
          error(error) {
            subscriber.next({ type: 'error', error, reset });
            reset = false;
          },
          complete() {
            subscriber.next({ type: 'complete', reset });
            reset = false;
          },
        });

        if (reset) {
          subscriber.next({ type: 'reset', reset });
          reset = false;
        }

        return subscription;
      });
    })
  );
}

function renderEventComparator<T>(
  previous: RenderEvent<T>,
  current: RenderEvent<T>
): boolean {
  if (previous.type !== current.type || previous.reset !== current.reset) {
    return false;
  }

  if (current.type === 'next') {
    return (previous as NextRenderEvent<T>).value === current.value;
  }

  if (current.type === 'error') {
    return (previous as ErrorRenderEvent).error === current.error;
  }

  return true;
}
