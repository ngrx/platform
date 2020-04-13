import {
  BehaviorSubject,
  combineLatest,
  EMPTY,
  NextObserver,
  Observable,
  PartialObserver,
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
import {
  CdStrategy,
  DEFAULT_STRATEGY_NAME,
  StrategySelection,
} from './strategy';
import { nameToStrategy } from './nameToStrategy';

export interface CdAware<U> extends Subscribable<U> {
  nextPotentialObservable: (value: any) => void;
  nextStrategy: (config: string) => void;
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
  strategies: StrategySelection<U>;
  resetContextObserver: NextObserver<undefined>;
  updateViewContextObserver: PartialObserver<U> & NextObserver<U>;
}): CdAware<U | undefined | null> {
  const strategyNameSubject = new BehaviorSubject<string>(
    DEFAULT_STRATEGY_NAME
  );
  const strategy$: Observable<CdStrategy<U>> = strategyNameSubject.pipe(
    nameToStrategy(cfg.strategies)
  );

  const potentialObservablesSubject = new Subject<Observable<U>>();
  const observablesFromTemplate$ = potentialObservablesSubject.pipe(
    distinctUntilChanged()
  );

  const rendering$ = combineLatest([observablesFromTemplate$, strategy$]).pipe(
    // Compose the observables from the template and the strategy
    switchMap(([observable$, strategy]) => {
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
      cfg.resetContextObserver.next(undefined);
      // Render the view
      strategy.render();

      return observable$.pipe(
        distinctUntilChanged(),
        // Update the value to render with the new emission
        tap(cfg.updateViewContextObserver),
        // apply behavior of passed strategy
        strategy.behaviour(),
        // Render the view
        tap(() => strategy.render()),
        // Swallow errors and log them
        catchError(e => {
          console.error(e);
          return EMPTY;
        })
      );
    })
  );

  return {
    nextPotentialObservable(value: any): void {
      potentialObservablesSubject.next(value);
    },
    nextStrategy(nextConfig: string): void {
      strategyNameSubject.next(nextConfig);
    },
    subscribe(): Subscription {
      return rendering$.subscribe();
    },
  } as CdAware<U | undefined | null>;
}
