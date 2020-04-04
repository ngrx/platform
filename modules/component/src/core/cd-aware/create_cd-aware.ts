import {
  combineLatest,
  NEVER,
  NextObserver,
  Observable,
  PartialObserver,
  Subject,
  Subscribable,
  Subscription,
} from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  map,
  startWith,
  switchMap,
  tap,
} from 'rxjs/operators';
import {
  CdStrategy,
  DEFAULT_STRATEGY_NAME,
  StrategySelection,
} from './strategy';

export interface CdAware<U> extends Subscribable<U> {
  nextVale: (value: any) => void;
  nextConfig: (config: string) => void;
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
  resetContextObserver: NextObserver<unknown>;
  updateViewContextObserver: PartialObserver<any>;
}): CdAware<U | undefined | null> {
  const configSubject = new Subject<string>();
  const config$: Observable<CdStrategy<U>> = configSubject.pipe(
    distinctUntilChanged(),
    startWith(DEFAULT_STRATEGY_NAME),
    map(
      (strategy: string): CdStrategy<U> =>
        cfg.strategies[strategy]
          ? cfg.strategies[strategy]
          : cfg.strategies.idle
    ),
    tap(strategy => console.log('strategy', strategy.name))
  );

  const observablesSubject = new Subject<Observable<U>>();
  const observables$$ = observablesSubject.pipe(distinctUntilChanged());

  let prevObservable;
  const renderSideEffect$ = combineLatest([observables$$, config$]).pipe(
    switchMap(([observable$, strategy]) => {
      if (prevObservable === observable$) {
        return NEVER;
      }
      prevObservable = observable$;

      if (observable$ === undefined || observable$ === null) {
        cfg.resetContextObserver.next(observable$);
        strategy.render();
        return NEVER;
      }

      return observable$.pipe(
        distinctUntilChanged(),
        tap(value => cfg.updateViewContextObserver.next(value)),
        strategy.behaviour(),
        tap(() => strategy.render())
      );
    })
  );

  return {
    nextVale(value: any): void {
      observablesSubject.next(value);
    },
    nextConfig(nextConfig: string): void {
      configSubject.next(nextConfig);
    },
    subscribe(): Subscription {
      return renderSideEffect$.subscribe();
    },
  } as CdAware<U | undefined | null>;
}
