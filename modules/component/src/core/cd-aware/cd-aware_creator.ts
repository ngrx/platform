import {
  BehaviorSubject,
  EMPTY,
  NextObserver,
  Observable,
  Subject,
  Subscribable,
  Subscription,
} from 'rxjs';
import {
  catchError,
  distinctUntilChanged,
  switchMap,
  tap,
} from 'rxjs/operators';
import { CdStrategy, DEFAULT_STRATEGY_NAME, StrategySet } from './strategy';

export interface CdAware<U> extends Subscribable<U> {
  nextPotentialObservable: (value: any) => void;
  nextStrategy: (config: string | Observable<string>) => void;
}

/**
 * class CdAware
 *
 * @description
 * This abstract class holds all the shared logic for the push pipe and the let directive
 * responsible for change detection
 * If you extend this class you need to implement how the update of the rendered value happens.
 * Also custom behaviour is something you need to implement in the extending class
 */
export function createCdAware<U>(cfg: {
  strategies: StrategySet<U>;
  resetContextObserver: NextObserver<void>;
  updateViewContextObserver: NextObserver<U | undefined | null>;
}): CdAware<U | undefined | null> {
  let strategy: CdStrategy<U> = cfg.strategies[DEFAULT_STRATEGY_NAME];

  const potentialObservablesSubject = new Subject<
    Observable<U> | undefined | null
  >();
  const observablesFromTemplate$ = potentialObservablesSubject.pipe(
    distinctUntilChanged()
  );

  const rendering$ = observablesFromTemplate$.pipe(
    // Compose the observables from the template and the strategy
    switchMap(observable$ => {
      // If the passed observable is:
      // - undefined - No value set
      // - null - null passed directly or no value set over `async` pipe
      if (observable$ == null) {
        // Update the value to render with null/undefined
        cfg.updateViewContextObserver.next(observable$);
        // Render the view
        strategy.render();
        // Stop further processing
        return EMPTY;
      }

      // If a new Observable arrives, reset the value to render
      // We do this because we don't know when the next value arrives and want to get rid of the old value
      cfg.resetContextObserver.next();
      strategy.render();

      return observable$.pipe(
        distinctUntilChanged(),
        tap(cfg.updateViewContextObserver),
        tap(() => strategy.render()),
        catchError(e => {
          console.error(e);
          return EMPTY;
        })
      );
    })
  );

  return {
    nextPotentialObservable(value: Observable<U> | undefined | null): void {
      potentialObservablesSubject.next(value);
    },
    nextStrategy(nextConfig: string): void {
      strategy =
        cfg.strategies[nextConfig] || cfg.strategies[DEFAULT_STRATEGY_NAME];
    },
    subscribe(): Subscription {
      return rendering$.subscribe();
    },
  } as CdAware<U | undefined | null>;
}
