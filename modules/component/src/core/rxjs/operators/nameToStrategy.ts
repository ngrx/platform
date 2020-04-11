import { Observable } from 'rxjs';
import { CdStrategy, StrategySelection } from './strategy';
import { distinctUntilChanged, map } from 'rxjs/operators';

export function nameToStrategy<U>(strategies: StrategySelection<U>) {
  return (o$: Observable<string>): Observable<CdStrategy<U>> => {
    return o$.pipe(
      distinctUntilChanged(),
      // convert a strategy name of type string into { render: () => void, behavior: () => OperatorFunction, name:string}
      map(
        (strategy: string): CdStrategy<U> =>
          strategies[strategy] ? strategies[strategy] : strategies.idle
      )
    );
  };
}
