import { Observable, pipe, ReplaySubject } from 'rxjs';
import { distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { ErrorRenderEvent, NextRenderEvent, RenderEvent } from './models';
import { combineRenderEventHandlers, RenderEventHandlers } from './handlers';
import {
  fromPotentialObservable,
  PotentialObservableResult,
} from '../potential-observable';

export interface RenderEventManager<PO> {
  nextPotentialObservable(potentialObservable: PO): void;
  handlePotentialObservableChanges(): Observable<
    RenderEvent<PotentialObservableResult<PO>>
  >;
}

export function createRenderEventManager<PO>(
  handlers: RenderEventHandlers<PotentialObservableResult<PO>>
): RenderEventManager<PO> {
  const handleRenderEvent = combineRenderEventHandlers(handlers);
  const potentialObservable$ = new ReplaySubject<PO>(1);

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

function switchMapToRenderEvent<PO>(): (
  source: Observable<PO>
) => Observable<RenderEvent<PotentialObservableResult<PO>>> {
  return pipe(
    switchMap((potentialObservable) => {
      const observable$ = fromPotentialObservable(potentialObservable);
      let reset = true;
      let synchronous = true;

      return new Observable<RenderEvent<PotentialObservableResult<PO>>>(
        (subscriber) => {
          const subscription = observable$.subscribe({
            next(value) {
              subscriber.next({ type: 'next', value, reset, synchronous });
              reset = false;
            },
            error(error) {
              subscriber.next({ type: 'error', error, reset, synchronous });
              reset = false;
            },
            complete() {
              subscriber.next({ type: 'complete', reset, synchronous });
              reset = false;
            },
          });

          if (reset) {
            subscriber.next({ type: 'suspense', reset, synchronous: true });
            reset = false;
          }
          synchronous = false;

          return subscription;
        }
      );
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
