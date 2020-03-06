import { Observable } from 'rxjs';
import { ignoreElements, tap } from 'rxjs/operators';
import {
  CoalesceConfig,
  coalesceWork,
  getCoalesceWorkConfig,
  isScheduling,
} from '../utils';

export function coalesce<T>(cfg?: CoalesceConfig) {
  return (o: Observable<T>): Observable<T> => {
    let firstSent = false;
    let last: T;
    return new Observable<T>(subscriber => {
      const preparedCfg = getCoalesceWorkConfig(cfg);
      return o
        .pipe(
          tap(n => {
            last = n;
            if (!firstSent && preparedCfg.leading) {
              firstSent = true;
              subscriber.next(last);
            }
            if (isScheduling(preparedCfg)) {
              return;
            }
            coalesceWork(() => {
              if (preparedCfg.trailing) {
                subscriber.next(last);
              }
            }, preparedCfg);
          }),
          ignoreElements()
        )
        .subscribe();
    });
  };
}
