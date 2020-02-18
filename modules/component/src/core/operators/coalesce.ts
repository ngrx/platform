import { Observable } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import {
  CoalesceConfig,
  getCoalesceWorkConfig,
  coalesceWork,
  isScheduling,
} from '../utils';

// @TODO consider throttle like config
export function coalesce<T>(cfg?: CoalesceConfig) {
  return (o: Observable<T>): Observable<T> => {
    return new Observable<T>(subscriber => {
      const prepedCfg = getCoalesceWorkConfig(cfg);
      return o
        .pipe(
          filter(_ => isScheduling(prepedCfg)),
          tap(_ => coalesceWork(() => {}, prepedCfg))
        )
        .subscribe(subscriber);
    });
  };
}
