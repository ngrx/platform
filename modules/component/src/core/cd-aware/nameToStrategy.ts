import { Observable } from 'rxjs';
import { distinctUntilChanged, map, startWith } from 'rxjs/operators';
import {
  CdStrategy,
  DEFAULT_STRATEGY_NAME,
  StrategySelection,
} from './strategy';

export function nameToStrategy<U>(strategies: StrategySelection<U>) {
  return (o$: Observable<string>): Observable<CdStrategy<U>> => {
    return o$.pipe(
      distinctUntilChanged(),
      startWith(DEFAULT_STRATEGY_NAME),
      map(
        (strategy: string): CdStrategy<U> =>
          strategies[strategy]
            ? strategies[strategy]
            : strategies[DEFAULT_STRATEGY_NAME]
      )
    );
  };
}
